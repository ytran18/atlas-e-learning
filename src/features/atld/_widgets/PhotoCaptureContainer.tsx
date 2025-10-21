import { PhotoCaptureContainer as SharedPhotoCaptureContainer } from "@/features/shared";

export const PhotoCaptureContainer = () => {
    return (
        <SharedPhotoCaptureContainer
            courseType="atld"
            paramKey="atldId"
            learnPath="/atld/[atldId]/learn"
        />
    );
};
