import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MantineProvider, Table, TextInput, ScrollArea, UnstyledButton, Group, Text, Center } from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

function FilterableTable() {
    const [subjects, setSubjects] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    useEffect(() => {
        axios.get('https://055d8281-4c59-4576-9474-9b4840b30078.mock.pstmn.io/subjects')
            .then(response => {
                setSubjects(response.data.data);
            })
            .catch(error => console.error("There was an error!", error));
    }, []);

    const handleSort = (field) => {
        const isReversed = sortBy === field ? !reverseSortDirection : false;
        setReverseSortDirection(isReversed);
        setSortBy(field);
    };

    const sortedAndFilteredSubjects = subjects
        .filter(subject =>
            Object.values(subject).some(value =>
                value.toString().toLowerCase().includes(filter.toLowerCase())
            )
        )
        .sort((a, b) => {
            if (!sortBy) return 0;
            if (reverseSortDirection) {
                return ('' + b[sortBy]).localeCompare(a[sortBy]);
            }
            return ('' + a[sortBy]).localeCompare(b[sortBy]);
        });



    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <div>
                <TextInput
                    placeholder="Filter by any field..."
                    value={filter}
                    onChange={(event) => setFilter(event.currentTarget.value)}
                    style={{ marginBottom: 20 }}
                />
                <ScrollArea>
                    <Table striped highlightOnHover>
                        <thead>
                        <tr>
                            {['ID', 'Name', 'Age', 'Gender', 'Diagnosis Date', 'Status'].map((header) => (
                                <th key={header}>
                                    <UnstyledButton onClick={() => handleSort(header.toLowerCase())}>
                                        <Group>
                                            <Text>{header}</Text>
                                            {sortBy === header.toLowerCase() && (
                                                <Center>
                                                    {reverseSortDirection ? <IconChevronUp /> : <IconChevronDown />}
                                                </Center>
                                            )}
                                        </Group>
                                    </UnstyledButton>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {sortedAndFilteredSubjects.map((subject, index) => (
                            <tr key={index}>
                                <td>{subject.id}</td>
                                <td>{subject.name}</td>
                                <td>{subject.age}</td>
                                <td>{subject.gender}</td>
                                <td>{new Date(subject.diagnosisDate).toLocaleDateString()}</td>
                                <td>{subject.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </ScrollArea>
            </div>
        </MantineProvider>
    );
}

export default FilterableTable;
