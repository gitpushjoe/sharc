export type Stage = {
    markDirty: () => void;
};

export type VisibilityEnum = "hidden" | "visible";

export type PropertyTypeEnum = "normal" | "aggregate" | "calculated";

export type Property<Type, Visibility extends boolean, Optional extends boolean> = {
    get: (this: Sprite<Type>) => Type;
    set: (this: Sprite<Type>, value: Type) => void;
    readonly _type?: Type; // not used at runtime
} & {
    configurable: false;
} & ThisType<Sprite<Type>> & {
        visible: Visibility;
        optional: Optional;
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

type Attributes<Visibility extends boolean = boolean, Optional extends boolean = boolean> = {
    readonly visible?: Visibility;
    readonly optional?: Optional;
};

export const Property = {
    Normal: <Type, Name extends string, Visibility extends boolean = false, Optional extends boolean = false>(
        name: Name,
        defaultValue: Type,
        attributes: Attributes<Visibility, Optional> = { visible: false as Visibility, optional: false as Optional }
    ): { [K in Name]: Property<Type, Visibility, Optional> } => {
        const symbol = Symbol(name);
        const prop: Property<Type, Visibility, Optional> = {
            visible: attributes.visible ?? (false as Visibility),
            optional: attributes.optional ?? (false as Optional),
            propertyType: "normal",
            configurable: false,
            get: function () {
                // this.stage.markDirty();
                return this[symbol];
            },
            set: function (value) {
                (this as Record<symbol, any>)[symbol] = value;
            }
        };
        return {
            [name]: prop,
            [symbol as any]: {
                value: defaultValue,
                writable: true,
                configurable: false
            } as NormalPropertyImpl<Type> as any
        } as { [K in Name]: Property<Type, Visibility, Optional> };
    },
    Calculated: <
        Type extends any,
        Name extends string,
        Visibility extends boolean = false,
        Optional extends boolean = false
    >(
        name: Name,
        methods: { get: Property<Type, Visibility, Optional>["get"]; set: Property<Type, Visibility, Optional>["set"] },
        attributes: Attributes<Visibility, Optional> = { visible: false as Visibility, optional: false as Optional }
    ): { [K in Name]: Property<Type, Visibility, Optional> } => {
        const prop: Property<Type, Visibility, Optional> = {
            visible: attributes.visible ?? (false as Visibility),
            optional: attributes.optional ?? (false as Optional),
            propertyType: "aggregate",
            configurable: false,
            get: methods.get,
            set: methods.set
        };
        return {
            [name]: prop
        } as { [K in Name]: Property<Type, Visibility, Optional> };
    },
    Aggregate: <
        T extends any,
        Mapping extends Record<string, [T, string]>,
        Name extends string,
        Visibility extends boolean = false,
        Optional extends boolean = false
    >(
        name: Name,
        mappings: Mapping,
        attributes: Attributes<Visibility, Optional> = { visible: false as Visibility, optional: false as Optional }
    ): { [K in Name]: Property<{ [L in keyof Mapping]: Mapping[L][0] }, Visibility, Optional> } => {
        const fakeNames: (keyof Mapping)[] = [];
        const realNames: Mapping[string][1][] = [];
        for (const [fake, real] of Object.entries(mappings)) {
            fakeNames.push(fake);
            realNames.push(real[1]);
        }
        return Property.Calculated(
            name,
            {
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
            },
            attributes
        );
    }
};

type SpriteBase = typeof SpriteBase;

type Blueprint<Base extends SpriteBase, Properties extends Record<string, Property<any, boolean, boolean>>> = {
    base: Base;
    properties: Properties;
};

const Blueprint = <Base extends SpriteBase, Properties extends Record<string, Property<any, boolean, boolean>>>(
    base: Base,
    properties: Properties
) => {
    return Object.freeze({ base, properties });
};

/** todo: come up with an actually good name for this */
// a disgusting abomination:
type Rendered<
    Properties extends Record<string, Property<any, boolean, boolean>>,
    Requirements extends { visible: boolean } = { visible: boolean }
> = Pick<
    {
        //                     👇 note the question mark here
        [K in keyof Properties]?: Required<Properties[K]>["_type"];
    },
    keyof {
        [K in keyof Properties as Properties[K]["visible"] extends Requirements["visible"]
            ? Properties[K]["optional"] extends true
                ? K
                : never
            : never]: any;
    }
> &
    Pick<
        {
            [K in keyof Properties]: Required<Properties[K]>["_type"];
        },
        keyof {
            [K in keyof Properties as Properties[K]["visible"] extends Requirements["visible"]
                ? Properties[K]["optional"] extends true
                    ? never
                    : K
                : never]: any;
        }
    >;

type Sprite<Properties = Record<string, any>> = SpriteBase & Properties & Record<symbol, any>;

const makeSpriteClass = <Base extends SpriteBase, Properties extends Record<string, Property<any, boolean, boolean>>>(
    blueprint: Blueprint<Base, Properties>
) => {
    const proto = { ...blueprint.base };
    Object.defineProperties(proto, blueprint.properties);

    return (props: Partial<Rendered<Properties, { visible: true }>> = {}): Sprite<Rendered<Properties>> => {
        const sprite = {};
        Object.setPrototypeOf(sprite, proto);
        const entries = Object.entries(props);
        for (let i = 0; i < entries.length; ++i) {
            const [lhs, rhs] = entries[i];
            sprite[lhs] = rhs;
        }
        return sprite as any;
    };
};

// ...

const SpriteBase = Object.freeze({
    stage: undefined as Stage | undefined
});

const SpriteBlueprint = Blueprint(
    { ...SpriteBase },
    {
        ...Property.Aggregate("bounds", { x1: [0, "x1"], y1: [0, "y1"], x2: [0, "x2"], y2: [0, "y2"] }, {
            visible: true
        } as const),
        ...Property.Normal("x1", 0, { visible: false } as const),
        ...Property.Normal("y1", 0, { visible: false } as const),
        ...Property.Normal("x2", 0, { visible: false } as const),
        ...Property.Normal("y2", 0, { visible: false } as const),
        ...Property.Normal("enabled", true, { visible: true } as const)
    }
);

const Sprite = makeSpriteClass(SpriteBlueprint);

// ...

const EllipseBlueprint = Blueprint(
    { ...SpriteBlueprint.base },
    { ...SpriteBlueprint.properties, ...Property.Normal("radius", 10, { visible: true } as const) }
);

const Ellipse = makeSpriteClass(EllipseBlueprint);
type Ellipse = ReturnType<typeof Ellipse>;

// ...

const ellipse1 = Ellipse({ enabled: true, radius: 5 });
const ellipse2 = Ellipse({ enabled: true, bounds: { x1: 10, y1: 10, x2: 20, y2: 20 } });
console.log(ellipse1, ellipse2);
