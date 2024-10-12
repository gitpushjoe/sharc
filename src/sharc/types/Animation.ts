export type EasingType = (x: number) => number;

export type AnimationCallback<PropertyType> = (
    property: PropertyType
) => PropertyType;

export type IsNumeric<T> =
    // 0 extends (1 & T) ? false :
    number extends T
        ? true
        : T extends number[]
          ? true
          : T extends Record<string, number>
            ? true
            : false;

export type PrivateAnimationType<Properties> = {
    [K in keyof Properties]: true extends IsNumeric<Required<Properties>[K]>
        ? {
              property: K;
              from: Properties[K] | null;
              to:
                  | NonNullable<Properties[K]>
                  | AnimationCallback<NonNullable<Properties[K]>>;
              duration: number;
              delay: number;
              easing: EasingType;
              frame?: number;
              channel?: number;
              name?: string;
              _from?: Properties[K]; // used by sprites to store the original value
              _to?: Properties[K];
          }
        : never;
}[keyof Properties];

export type AnimationType<Properties> = NonNullable<
    {
        [K in keyof Properties]: true extends IsNumeric<Required<Properties>[K]>
            ? {
                  property: K;
                  from: Properties[K] | null;
                  to:
                      | NonNullable<Properties[K]>
                      | AnimationCallback<NonNullable<Properties[K]>>;
                  duration?: number;
                  delay?: number;
                  easing?: EasingType;
                  name?: string;
              }
            : never;
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
