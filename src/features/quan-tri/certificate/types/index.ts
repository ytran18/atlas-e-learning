export interface QRCodeData {
    id1: string;
    id2: string;
    name: string;
    birthDate: string;
    gender: string;
    country: string;
    dateOfIssue: string;
}

export interface CertificateFormData {
    studentName: string;
    courseName: string;
    birthYear: string;
    certificateId: string;
}

export interface StudentSearchResult {
    objectID: string;
    userFullname: string;
    cccd: string;
    userBirthDate: string;
    userIdCard?: string;
    isCompleted?: boolean;
    groupId?: string;
    courseName?: string;
}
