
/**
 * need to make sure to not have the same prop twice in case the signature has changed
 * second argument Added will override the first
 */
export type Union<Initial, Added> = Added & Diff<Initial, Added>;

export type Diff<Initial, Removed> = Omit<Initial, keyof Removed>;

export type Shared<A, B> = Pick<A, Extract<keyof A, keyof B>>;

/**
 * props for a composed component, the one created by the HOC,
 * are the props required for the inner component minus those which were created plus those which are dropped
 * dropped props are presumably required by the HOC for mapping etc. but not needed by the inner component
 * calling this MapRequires instead of Dropped because some might be passed through
 * what is important is that these are required by the HOC regardless of the inner
 */
export type OuterProps<Inner, MapRequires, MapReturns> = Union<Diff<Inner, MapReturns>, MapRequires>;
