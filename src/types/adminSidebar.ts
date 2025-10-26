export interface Group {
    id: number;
    name: string;
    color: string;

    icon: any;
    totalStudents?: number;
}

export interface GroupSidebarProps {
    title?: string;
    groups: Group[];
    selectedGroup: Group;
    onSelectGroup: (group: Group) => void;
}
