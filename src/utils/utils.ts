import { IPreviewData } from "../components/bc-json-file-input/bc-json-file-input";

export function format(first: string, middle: string, last: string): string {
    return (
        (first || "") + (middle ? ` ${middle}` : "") + (last ? ` ${last}` : "")
    );
}

export const processJsonFiles = (files: File[]): Promise<IPreviewData[]> => {
    const JSON_FILE_TYPE = "application/json";

    // Init the preview list
    let previewList: IPreviewData[] = files.map((file) => ({
        fileName: file.name,
        content: "",
        error: false,
        isLoading: true,
    }));

    const updatePreviewFile = (
        fileName: string,
        content: string,
        error = false
    ) => {
        // Map the data to update and preserve file ordering
        previewList = previewList.map((data) => {
            if (data.fileName === fileName) {
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
    };

    return new Promise((resolve) => {
        // read files and async update the preview list
        files.forEach((file) => {
            if (file.type !== JSON_FILE_TYPE) {
                updatePreviewFile(file.name, "Error: json files only", true);
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("loadend", ({ target }) => {
                updatePreviewFile(file.name, target.result as string);
                if (previewList.every((item) => !item.isLoading)) {
                    resolve(previewList);
                }
            });
            reader.readAsText(file);
        });
    });
};
