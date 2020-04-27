import { format } from "./utils";

/* 
    Jest FileReader Mock
    - https://github.com/Shopify/quilt/issues/303
    Jest General Mocks
    - https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname
*/
describe("format", () => {
    it("returns empty string for no names defined", () => {
        expect(format(undefined, undefined, undefined)).toEqual("");
    });

    it("formats just first names", () => {
        expect(format("Joseph", undefined, undefined)).toEqual("Joseph");
    });

    it("formats first and last names", () => {
        expect(format("Joseph", undefined, "Publique")).toEqual(
            "Joseph Publique"
        );
    });

    it("formats first, middle and last names", () => {
        expect(format("Joseph", "Quincy", "Publique")).toEqual(
            "Joseph Quincy Publique"
        );
    });
});
