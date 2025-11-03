import { FunctionComponent, PropsWithChildren } from "react";

import MaintenancePage from ".";

type MaintenanceWrapperProps = PropsWithChildren;

const MaintenanceWrapper: FunctionComponent<MaintenanceWrapperProps> = ({ children }) => {
    const isMaintenanceMode = true;

    if (isMaintenanceMode) {
        return <MaintenancePage />;
    }

    return <>{children}</>;
};

export default MaintenanceWrapper;
