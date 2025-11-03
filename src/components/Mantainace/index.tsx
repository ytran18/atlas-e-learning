import { Result } from "antd";

const MaintenancePage = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Result
                status="404"
                title="Trang web đang trong quá trình bảo trì. Vui lòng quay lại sau."
                subTitle="Xin lỗi vì sự bất tiện này."
            />
        </div>
    );
};

export default MaintenancePage;
