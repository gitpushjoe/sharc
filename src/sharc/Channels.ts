import { AnimationPackage, PrivateAnimationType, AnimationType, AnimationParams } from "./types/Animation";

export const DEFAULT_ANIMATION_PARAMS: AnimationParams = {
    loop: false,
    iterations: 1,
    delay: 0,
};

/**
 * A channel is a queue of animations that can be played in sequence.
 * The current animation will always be the package at the front of the queue, and will be removed once it is finished.
 * 
 * @template Properties Used to determine which properties can be animated, and which value types are valid.
 */
export class Channel<Properties> {
    private queue: AnimationPackage<Properties>[];
    private index: number;
    private step: number;

    constructor() {
        this.queue = [];
        this.index = 0;
        this.step = 0;
    }

    /**
     * Returns the current animation package, or undefined if the queue is empty.
     */
    private currentPackage(): AnimationPackage<Properties>|undefined {
        return this.queue[0];
    }

    /**
     * Returns the current animation, or undefined if the queue is empty.
     */
    private currentAnimation(): PrivateAnimationType<Properties>|undefined {
        return this.currentPackage()?.animations[this.index % this.currentPackage()!.animations.length];
    }

    public queueIsEmpty(): boolean {
        return this.queue.length === 0;
    }

    public stepForward(): PrivateAnimationType<Properties>|null {
        if (this.queueIsEmpty())
            return null;
        this.step++;
        if (this.step > this.currentAnimation()!.delay + this.currentAnimation()!.duration + this.currentPackage()!.params.delay!) {
            this.step = 0;
            this.index++;
            if (this.index >= this.currentPackage()!.animations.length * this.currentPackage()!.params.iterations!) {
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
        if (this.step < this.currentAnimation()!.delay + this.currentPackage()!.params.delay!) {
            return null;
        }
        this.currentAnimation()!.frame = Math.max(this.step - this.currentAnimation()!.delay - this.currentPackage()!.params.delay!, 0);
        this.currentAnimation()!.channel = this.index;
        return this.currentAnimation()!;
    }

    private verifyAnimations(
        animations: AnimationType<Properties>|AnimationType<Properties>[],
        params: AnimationParams = DEFAULT_ANIMATION_PARAMS
    ) {
        const [loop, iterations, delay] = [Boolean(params.loop), params.iterations ?? 1, params.delay ?? 0];
        if (!Array.isArray(animations)) {
            animations = [animations];
        }
        if (animations.length === 0) {
            return undefined;
        }
        for (const idx in animations) {
            const animation = animations[idx];
            if (animation.duration <= 0) 
                throw new Error('Animation duration must be greater than 0');
            if (animation.delay < 0)
                animation.delay = 0;
        }
        return { animations, params: { loop, iterations, delay } };
    }

    /**
     * Creates an animation package and adds it to the rear of the queue.
     * @returns the channel instance
     */
    public push(
        animations: AnimationType<Properties>|AnimationType<Properties>[],
        params: AnimationParams = DEFAULT_ANIMATION_PARAMS
    ) {
        const pkg = this.verifyAnimations(animations, params);
        if (pkg) {
            this.queue.push(pkg);
        }
        return this;
    }

    /**
     * Creates an animation package and adds it to the front of the queue, resetting the progress of the channel.
     * @returns the channel instance
     */
    public unshift(
        animations: AnimationType<Properties>|AnimationType<Properties>[],
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

    /**
     * Removes the animation package at the front of the queue.
     * @returns The animation package at the front of the queue, or undefined if the queue is empty.
     */
    public shift(): AnimationPackage<Properties>|undefined {
        return this.queue.shift();
    }

    /**
     * Removes the last animation package from the queue.
     * @returns The animation package at the rear of the queue, or undefined if the queue is empty.
     */
    public pop(): AnimationPackage<Properties>|undefined {
        return this.queue.pop();
    }

    /**
     * Removes the animation at the front of the queue.
     * @returns The animation at the front of the queue, or undefined if the queue is empty.
     */
    public shiftAnimation(): AnimationType<Properties>|undefined {
        const animation = this.currentPackage()?.animations.shift() as AnimationType<Properties>|undefined;
        if (this.currentPackage()?.animations.length === 0) {
            this.queue.shift();
        }
        return animation;
    }

    /**
     * Removes the last animation from the queue.
     * @returns The animation at the rear of the queue, or undefined if the queue is empty.
     */
    public popAnimation(): AnimationType<Properties>|undefined {
        const animation = this.currentPackage()?.animations.pop() as AnimationType<Properties>|undefined;
        if (this.currentPackage()?.animations.length === 0) {
            this.queue.pop();
        }
        return animation;
    }

    public enqueue(
        animations: AnimationType<Properties>|AnimationType<Properties>[],
        index: number = 1,
        params: AnimationParams = DEFAULT_ANIMATION_PARAMS,
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

    /**
     * Clears the queue.
     */
    public clear(): this {
        this.queue = [];
        this.index = 0;
        this.step = 0;
        return this;
    }

    /**
     * @returns All animation packages in the queue.
     */
    public get animations(): AnimationPackage<Properties>[] {
        return [...this.queue];
    }
}