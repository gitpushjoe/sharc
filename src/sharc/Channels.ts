import { AnimationPackage, AnimationType, PublicAnimationType, AnimationParams } from "./types/Animation";

/**
 * A channel is a queue of animations that can be played in sequence.
 * The current animation will always be the package at the front of the queue, and will be removed once it is finished.
 * 
 * @template ValidProperties Used to determine which properties can be animated, and which value types are valid.
 */
export class Channel<ValidProperties> {
    private queue: AnimationPackage<ValidProperties>[];
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
    public currentPackage(): AnimationPackage<ValidProperties>|undefined {
        return this.queue[0];
    }

    /**
     * Returns the current animation, or undefined if the queue is empty.
     */
    public currentAnimation(): AnimationType<ValidProperties>|undefined {
        return this.currentPackage()?.animations[this.index % this.currentPackage()!.animations.length];
    }

    public queueIsEmpty(): boolean {
        return this.queue.length === 0;
    }

    public stepForward(): AnimationType<ValidProperties>|null {
        if (this.queueIsEmpty())
            return null;
        this.step++;
        if (this.step > this.currentAnimation()!.delay + this.currentAnimation()!.duration) {
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
        this.currentAnimation()!.frame = Math.max(this.step - this.currentAnimation()!.delay, 0);
        this.currentAnimation()!.channel = this.index;
        return this.currentAnimation()!;
    }

    private verifyAnimations(
        animations: PublicAnimationType<ValidProperties>|PublicAnimationType<ValidProperties>[],
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
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
        animations: PublicAnimationType<ValidProperties>|PublicAnimationType<ValidProperties>[],
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
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
        animations: PublicAnimationType<ValidProperties>|PublicAnimationType<ValidProperties>[],
        params: AnimationParams = { loop: false, iterations: 1, delay: 0 }
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
    public shift(): AnimationPackage<ValidProperties>|undefined {
        return this.queue.shift();
    }

    /**
     * Removes the last animation package from the queue.
     * @returns The animation package at the rear of the queue, or undefined if the queue is empty.
     */
    public pop(): AnimationPackage<ValidProperties>|undefined {
        return this.queue.pop();
    }

    /**
     * Removes the animation at the front of the queue.
     * @returns The animation at the front of the queue, or undefined if the queue is empty.
     */
    public shiftAnimation(): AnimationType<ValidProperties>|undefined {
        return this.currentPackage()?.animations.shift();
    }

    /**
     * Removes the last animation from the queue.
     * @returns The animation at the rear of the queue, or undefined if the queue is empty.
     */
    public popAnimation(): AnimationType<ValidProperties>|undefined {
        return this.currentPackage()?.animations.pop();
    }

    /**
     * Tries to set the animation at the given index of the current package.
     * If the index is greater than the length of the package, the animation will be pushed to the end of the package.
     * Setting animationIndex to 2 could be useful to send several animations to a sprite in a short period of time, without having the sprite move/act in a jittery motion.
     * 
     * @param animation The animation to set.
     * @param animationIndex The index to attempt to set the animation at.
     * @returns the channel instance
     */
    public setAnimation(
        animation: PublicAnimationType<ValidProperties>,
        animationIndex: number = 0,
    ) {
        if (this.currentPackage === undefined) {
            return this;
        }
        const pkgLength = this.currentPackage()!.animations.length;
        if (animationIndex > pkgLength) {
            this.currentPackage()!.animations.push(animation);
            return this;
        }
        this.currentPackage()!.animations[animationIndex] = animation;
        return this;
    }

    /**
     * Clears the queue.
     */
    public clear() {
        this.queue = [];
        this.index = 0;
        this.step = 0;
    }

    /**
     * @returns All animation packages in the queue.
     */
    public get animations(): AnimationPackage<ValidProperties>[] {
        return [...this.queue];
    }
}