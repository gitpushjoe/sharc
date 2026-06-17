export type Stage = {
    markDirty: () => void;
};

export type Sprite = {
    stage: Stage;
};

export type VisibilityEnum = "hidden" | "visible";

export type PropertyTypeEnum = "normal" | "aggregate" | "calculated";

export type Property<Type> = {
    get: () => Type;
    set: (value: Type) => void;
    readonly _type?: Type; // not used at runtime; TODO: allow for undefined values(?)
} & {
    configurable: false;
} & ThisType<Sprite> & {
        visibility: VisibilityEnum;
        propertyType: PropertyTypeEnum;
    };

export type NormalPropertyImpl<Type> = {
    value: Type;
} & {
    writable: true;
    configurable: false;
} & ThisType<Sprite> & {};

export const test = <T extends string>(t: T): Record<T, number> => {
    const t2: T = t;
    const thing = { [t2]: 42 } as Record<T, number>;
    return thing;
};

export const Property = {
    Normal: <Type, Name extends string>(name: Name, defaultValue: Type): { [K in Name]: Property<Type> } => {
        const symbol = Symbol(name);
        const prop: Property<Type> = {
            visibility: "visible",
            propertyType: "normal",
            configurable: false,
            get: function () {
                // this.stage.markDirty();
                return this[symbol];
            },
            set: function (value) {
                this[symbol] = value;
            }
        };
        return {
            [name]: prop,
            [symbol as any]: {
                value: defaultValue,
                writable: true,
                configurable: false
            } as NormalPropertyImpl<Type> as any
        } as { [K in Name]: Property<Type> };
    },
    Aggregate: <T extends any, Mapping extends Record<string, [T, string]>, Name extends string>(
        name: Name,
        mappings: Mapping
    ): { [K in Name]: Property<{ [L in keyof Mapping]: Mapping[L][0] }> } => {
        const fakeNames: (keyof Mapping)[] = [];
        const realNames: Mapping[string][1][] = [];
        for (const [fake, real] of Object.entries(mappings)) {
            fakeNames.push(fake);
            realNames.push(real[1]);
        }
        const prop: Property<{ [K in keyof Mapping]: Mapping[K][0] }> = {
            visibility: "visible",
            propertyType: "aggregate",
            configurable: false,
            get: function () {
                const res: { [K in keyof Mapping]: Mapping[K][0] } = {} as any;
                for (let i = 0; i < fakeNames.length; ++i) {
                    res[fakeNames[i] as keyof Mapping] = (this as Record<Mapping[string][1], T>)[realNames[i]];
                }
                return res;
            },
            set: function (value) {
                for (let i = 0; i < fakeNames.length; ++i) {
                    const val = value[fakeNames[i]];
                    if (!val) {
                        continue;
                    }
                    (this as Record<Mapping[string][1], T>)[realNames[i]] = val;
                }
            }
        };
        return {
            [name]: prop
        } as { [K in Name]: Property<{ [L in keyof Mapping]: Mapping[L][0] }> };
    }
};

const prop = {
    ...Property.Normal("x", 1024),
    ...Property.Normal("y", 1024),
    ...Property.Normal("z", 1024),
    ...Property.Aggregate("pos", { x: [0, "x"], y: [0, "y"], z: [0, "z"] }),
    ...Property.Aggregate("pos2", { x2: [0, "x"], y2: [0, "y"], z2: [0, "z"] })
};

const makeSprite = <Props extends Record<string, Property<any>>>(
    props: Props
): {
    [K in keyof typeof props]: Required<Props[K]>["_type"];
} => {
    const obj = {};
    Object.defineProperties(obj, props);
    return obj as any;
};

const obj = makeSprite(prop);
// obj.x = 42;
//
obj.pos2 = { x2: 10, y2: 10, z2: -6 };

console.log(obj.pos, obj.x, obj.y, obj.z, obj.pos2);
