export type EasingType = (x: number) => number;

export type AnimationCallback<PropertyType> = (property: PropertyType) => PropertyType;

export type PrivateAnimationType<Properties> = {
    [K in keyof Properties]: {
        property: K;
        from: (Properties[K] & (number | Record<string, number>)) | null;
        to:
            | (Properties[K] & (number | Record<string, number>))
            | AnimationCallback<Properties[K] & (number | Record<string, number>)>;
        duration: number;
        delay: number;
        easing: EasingType;
        frame?: number;
        channel?: number;
        name?: string;
        _from?: Properties[K] & (number | Record<string, number>); // used by sprites to store the original value
        _to?: Properties[K] & (number | Record<string, number>);
    };
}[keyof Properties];

export type AnimationType<Properties> = NonNullable<
    {
        [K in keyof Properties]: {
            property: K;
            from: (Properties[K] & (number | Record<string, number>)) | null;
            to:
                | (Properties[K] & (number | Record<string, number>))
                | AnimationCallback<Properties[K] & (number | Record<string, number>)>;
            duration?: number;
            delay?: number;
            easing?: EasingType;
            name?: string;
        };
    }[keyof Properties]
>;

export type AnimationParams = {
    loop?: boolean;
    iterations?: number;
    delay?: number;
};

export type AnimationPackage<ValidProperties> = {
    animations: PrivateAnimationType<ValidProperties>[];
    params: AnimationParams;
};
