import { JsonFileProcessor } from "./utils";

/* 
    Stencil Unit Testing
    - https://medium.com/@tally_b/unit-testing-stenciljs-1-0-c4e902a4e63c

    Manual Mocks - import mock before the file to be tested
    - https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
*/

type FileWithResult = Partial<File> & { result: string };

const generateFiles = (count, type = "application/json"): FileWithResult[] => {
    if (count <= 0) return [];
    return new Array(count).fill(0).map((_, index) => {
        const file: FileWithResult = {
            name: "" + index,
            type,
            result: JSON.stringify({
                name: "" + index,
            }),
        };
        return file;
    });
};

const createMockFileReader = (files: FileWithResult[]) => {
    class MockFileReader {
        private callback: Function;

        addEventListener = jest.fn((type: string, callback: Function) => {
            this.callback = callback;
        });

        readAsText(file: File) {
            const targetFile = files.find((f) => f.name === file.name);
            const result: Partial<ProgressEvent<FileReader>> = {
                target: {
                    result: targetFile.result,
                } as FileReader,
            };
            setTimeout(() => {
                this.callback(result);
            });
        }
    }

    return MockFileReader;
};

describe("JsonFileProcessor", () => {
    const originalFileReader = (global as any).FileReader; // probably undefined

    afterEach(() => {
        (global as any).FileReader = originalFileReader;
    });

    it("todo", async () => {
        const files = generateFiles(3);
        (global as any).FileReader = createMockFileReader(files) as any;
        const processor = new JsonFileProcessor();
        const result = await processor.process(files as File[]);
        expect(result.length).toBe(3);
    });
});
