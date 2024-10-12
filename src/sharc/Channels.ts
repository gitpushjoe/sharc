import {
    AnimationPackage,
    PrivateAnimationType,
    AnimationType,
    AnimationParams
} from "./types/Animation";

export const DEFAULT_ANIMATION_PARAMS: AnimationParams = {
    loop: false,
    iterations: 1,
    delay: 0
};

export class Channel<Properties> {
    private queue: AnimationPackage<Properties>[];
    private index: number;
    private step: number;

    constructor() {
        this.queue = [];
        this.index = 0;
        this.step = 0;
    }

    private currentPackage(): AnimationPackage<Properties> | undefined {
        return this.queue[0];
    }

    private currentAnimation(): PrivateAnimationType<Properties> | undefined {
        return this.currentPackage()?.animations[
            this.index % this.currentPackage()!.animations.length
        ];
    }

    public queueIsEmpty(): boolean {
        return this.queue.length === 0;
    }

    public stepForward(): PrivateAnimationType<Properties> | null {
        if (this.queueIsEmpty()) return null;
        this.step++;
        if (
            this.step >
            this.currentAnimation()!.delay +
                this.currentAnimation()!.duration +
                this.currentPackage()!.params.delay!
        ) {
            this.step = 0;
            this.index++;
            if (
                this.index >=
                this.currentPackage()!.animations.length *
                    this.currentPackage()!.params.iterations!
            ) {
                this.index = 0;
                if (this.currentPackage()!.params.loop) {
                    this.step = 0;
                } else {
                    this.queue.shift();
                }
            }
            if (this.queue.length === 0) {
                this.index = 0;
                this.step = 0;
                return null;
            }
        }
        if (
            this.step <
            this.currentAnimation()!.delay +
                this.currentPackage()!.params.delay!
        ) {
            return null;
        }
        this.currentAnimation()!.frame = Math.max(
            this.step -
                this.currentAnimation()!.delay -
                this.currentPackage()!.params.delay!,
            0
        );
        this.currentAnimation()!.channel = this.index;
        return this.currentAnimation()!;
    }

    private verifyAnimations(
        animations: AnimationType<Properties> | AnimationType<Properties>[],
        params: AnimationParams = DEFAULT_ANIMATION_PARAMS
    ) {
        const [loop, iterations, delay] = [
            Boolean(params.loop),
            params.iterations ?? 1,
            params.delay ?? 0
        ];
        if (!Array.isArray(animations)) {
            animations = [animations];
        }
        if (animations.length === 0) {
            return undefined;
        }
        for (let idx = 0; idx < animations.length; idx++) {
            const animation = animations[idx];
            animation.delay ??= 0;
            animation.duration ??= 60;
            animation.easing ??= (x: number) => x;
            animation.name ??= "";
            if (animation.duration <= 0)
                throw new Error("Animation duration must be greater than 0");
            if (animation.delay < 0) animation.delay = 0;
        }
        return {
            animations: animations as PrivateAnimationType<Properties>[],
            params: { loop, iterations, delay }
        };
    }

    public push(
        animations: AnimationType<Properties> | AnimationType<Properties>[],
        params: AnimationParams = DEFAULT_ANIMATION_PARAMS
    ) {
        const pkg = this.verifyAnimations(animations, params);
        if (pkg) {
            this.queue.push(pkg);
        }
        return this;
    }

    public unshift(
        animations: AnimationType<Properties> | AnimationType<Properties>[],
        params: AnimationParams = DEFAULT_ANIMATION_PARAMS
    ) {
        const pkg = this.verifyAnimations(animations, params);
        if (pkg) {
            this.queue.unshift(pkg);
            this.step = 0;
            this.index = 0;
        }
        return this;
    }

    public shift(): AnimationPackage<Properties> | undefined {
        return this.queue.shift();
    }

    public pop(): AnimationPackage<Properties> | undefined {
        return this.queue.pop();
    }

    public shiftAnimation(): AnimationType<Properties> | undefined {
        const animation = this.currentPackage()?.animations.shift() as
            | AnimationType<Properties>
            | undefined;
        if (this.currentPackage()?.animations.length === 0) {
            this.queue.shift();
        }
        return animation;
    }

    public popAnimation(): AnimationType<Properties> | undefined {
        const animation = this.currentPackage()?.animations.pop() as
            | AnimationType<Properties>
            | undefined;
        if (this.currentPackage()?.animations.length === 0) {
            this.queue.pop();
        }
        return animation;
    }

    public enqueue(
        animations: AnimationType<Properties> | AnimationType<Properties>[],
        index = 1,
        params: AnimationParams = DEFAULT_ANIMATION_PARAMS
    ) {
        if (this.currentPackage() === undefined) {
            this.push(animations, params);
            return this;
        }
        if (index === 0) {
            this.clear();
            this.push(animations, params);
            return this;
        }
        if (index <= this.queue.length) {
            this.queue[index] = this.verifyAnimations(animations, params)!;
            return this;
        }
        this.push(animations, params);
        return this;
    }

    public clear(): this {
        this.queue = [];
        this.index = 0;
        this.step = 0;
        return this;
    }

    public get animations(): AnimationPackage<Properties>[] {
        return this.queue.map(pkg => {
            return { ...pkg };
        });
    }
}
