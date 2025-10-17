import { Group, Text } from "@mantine/core";

interface AccordionLabelProps {
    label: string;
    description: string;
}

const AccordionLabel = ({ label, description }: AccordionLabelProps) => {
    return (
        <Group wrap="nowrap">
            <div>
                <Text>{label}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                    {description}
                </Text>
            </div>
        </Group>
    );
};

export default AccordionLabel;
