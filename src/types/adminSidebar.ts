export interface Group {
    id: number;
    name: string;
    color: string;
    // eslint-disable-next-line
    icon: any;
    totalStudents?: number;
}

export interface GroupSidebarProps {
    title?: string;
    groups: Group[];
    selectedGroup: Group;
    onSelectGroup: (group: Group) => void;
}
