import * as XLSX from "xlsx-js-style";

export const exportToXLSX = async (data: any, filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Lấy tất cả các keys từ data để xử lý header
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    // Tính toán độ rộng cho mỗi cột
    const columnWidths: { wch: number }[] = [];
    headers.forEach((header) => {
        // Bắt đầu với độ dài của header
        let maxWidth = header.length;

        // Kiểm tra độ dài của tất cả các giá trị trong cột
        data.forEach((row: any) => {
            const cellValue = row[header];
            const cellLength = cellValue ? String(cellValue).length : 0;
            maxWidth = Math.max(maxWidth, cellLength);
        });

        // Thêm padding và giới hạn độ rộng tối đa (tăng lên 80 để hiển thị tốt hơn)
        columnWidths.push({ wch: Math.min(maxWidth + 2, 80) });
    });

    worksheet["!cols"] = columnWidths;

    // Styling cho tất cả các cell
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

            if (!worksheet[cellAddress]) continue;

            // Style cho header (dòng đầu tiên)
            if (row === 0) {
                worksheet[cellAddress].s = {
                    font: {
                        bold: true,
                        color: { rgb: "FFFFFF" },
                        sz: 12,
                    },
                    fill: {
                        patternType: "solid",
                        fgColor: { rgb: "4472C4" },
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: "center",
                        wrapText: true,
                    },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    },
                };
            } else {
                // Style cho các cell dữ liệu
                worksheet[cellAddress].s = {
                    alignment: {
                        vertical: "top",
                        wrapText: true,
                    },
                    border: {
                        top: { style: "thin", color: { rgb: "D3D3D3" } },
                        bottom: { style: "thin", color: { rgb: "D3D3D3" } },
                        left: { style: "thin", color: { rgb: "D3D3D3" } },
                        right: { style: "thin", color: { rgb: "D3D3D3" } },
                    },
                };
            }
        }
    }

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${filename}.xlsx`);
};
