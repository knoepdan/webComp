// equivalent of C# nameof operator: nameof<Person>("name"); -> returns "name"
export const nameof = <T>(n: keyof T) => n;
// the nameof factory is useful if we don't want to write the generic type every time we use the nameof function:
// var nameOfPerson = nameofFactory<Person>();
// nameOfPerson("name") -> "name";
export const nameofFactory =
  <T>() =>
  (name: keyof T) =>
    name;

/** STRUCTURAL NAMEOF */

/** KeyOfSkipArray: Helpers to get the properties from an object or from the "subobject" when T is an array. Otherwise we would get the properties
 * of the Array, which are "filter, reverse, map, reduce..."
 */
type KeyOfSkipArray<T> = T extends any[] ? keyof T[number] : keyof T;
/** ValueByKeyOfSkipArray: This is the Inverse of KeyOfSkipArray. With a Key (property) it gets the Value of the property in the Object (T).
 * But if T is an Array the it gets the value of that property for the Array Subtype (T = Subtype[])
 */
type ValueByKeyOfSkipArray<T, TKey> = T extends any[]
  ? TKey extends keyof T[number]
    ? T[number][TKey]
    : never
  : TKey extends keyof T
  ? T[TKey]
  : never;

/** This works until P3 or P4 (depending on the TS version used), then it gets a
 * "Type instantiation is excessively deep and possibly infinite.ts(2589)" */
type structuralNameOfWithArray<TObject> = {
  <
    P1 extends keyof TObject,
    P2 extends KeyOfSkipArray<TObject[P1]>,
    P3 extends KeyOfSkipArray<ValueByKeyOfSkipArray<TObject[P1], P2>>,
    P4 extends KeyOfSkipArray<
      ValueByKeyOfSkipArray<ValueByKeyOfSkipArray<TObject[P1], P2>, P3>
    >
    //P5 extends KeyOfSkipArray<ValueByKeyOfSkipArray<ValueByKeyOfSkipArray<ValueByKeyOfSkipArray<TObject[P1], P2>, P3>, P4>>,
    //P5 extends any,
  >(
    p1: P1,
    p2?: P2,
    p3?: P3,
    p4?: P4,
    ...p5: string[]
  ): string;
};

/** Runtime implementation */
export function structuralNameOfWithArray<T>(): structuralNameOfWithArray<T> {
  return (...props) => props.join("/");
}

/*
 // TEST 'structuralNameOfWithArray'
 interface TestObjet {
        Array1: {
            ArProp: TestObjet;
        }[],
        Prop1: {
            PProp: TestObjet;
        },
    }

var structuralNameOfWithArrayTest2 = structuralNameOfWithArray<TestObjet>();
const propArr4 = structuralNameOfWithArrayTest2("Array1", "ArProp", "Prop1", "PProp"); // "Array1/ArProp/Prop1/PProp"
 
 
 */
