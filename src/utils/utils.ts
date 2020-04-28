import { IPreviewData } from "../components/bc-json-file-input/bc-json-file-input";

export class JsonFileProcessor {
    private readonly JSON_FILE_TYPE = "application/json";
    private files: ReadonlyArray<File>;
    private previewList: ReadonlyArray<IPreviewData>;

    constructor() {}

    process(files: File[]): Promise<ReadonlyArray<IPreviewData>> {
        this.initFiles(files);
        return new Promise((resolve) => {
            // read files and async update the preview list
            this.files.forEach((file) => {
                // Check if file can be processed
                if (file.type !== this.JSON_FILE_TYPE) {
                    this.updatePreviewFile(
                        file.name,
                        "Error: json files only",
                        true
                    );
                    if (this.isProcessingComplete) resolve(this.previewList);
                    return;
                }

                const reader = new FileReader();
                reader.addEventListener("loadend", ({ target }) => {
                    this.updatePreviewFile(file.name, target.result as string);
                    if (this.isProcessingComplete) resolve(this.previewList);
                });
                reader.readAsText(file);
            });
        });
    }

    private get isProcessingComplete() {
        return this.previewList.every((item) => !item.isLoading);
    }

    private initFiles(files: File[]) {
        this.files = files;
        this.previewList = files.map((file) => ({
            fileName: file.name,
            content: "",
            error: false,
            isLoading: true,
        }));
    }

    private updatePreviewFile(name: string, content: string, error = false) {
        // Map the data to update and preserve file ordering
        this.previewList = this.previewList.map((data) => {
            if (data.fileName === name) {
                let prettyContent: string;
                try {
                    prettyContent = JSON.stringify(
                        JSON.parse(content),
                        null,
                        2
                    );
                } catch {
                    prettyContent = content;
                }
                return {
                    ...data,
                    content: prettyContent,
                    error,
                    isLoading: false,
                };
            } else {
                return data;
            }
        });
    }
}
