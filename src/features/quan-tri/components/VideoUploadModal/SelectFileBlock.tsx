import { FunctionComponent } from "react";

import { Card } from "@mantine/core";

type SelectFileBlockProps = {
    selectedFile: File;
};

const SelectFileBlock: FunctionComponent<SelectFileBlockProps> = ({ selectedFile }) => {
    return (
        <Card withBorder radius="md">
            <p className="text-base font-bold">File đã chọn:</p>

            <p className="text-sm">
                <strong>Tên:</strong> {selectedFile.name}
            </p>

            <p className="text-sm">
                <strong>Kích thước:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>

            <p className="text-sm">
                <strong>Loại:</strong> {selectedFile.type}
            </p>
        </Card>
    );
};

export default SelectFileBlock;
