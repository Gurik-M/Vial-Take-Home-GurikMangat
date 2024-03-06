import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
    rem, MantineProvider,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import classes from './tablesort.module.scss';

interface RowData {
    id: string;
    name: string;
    age: number;
    gender: string;
    diagnosisDate: string;
    status: string;
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        Object.keys(item).some((key) => item[key].toString().toLowerCase().includes(query))
    );
}

function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
                return payload.reversed ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
            } else {
                const aValue = a[sortBy].toString(),
                    bValue = b[sortBy].toString();
                return payload.reversed ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
            }
        }),
        payload.search
    );
}

function TableSort() {
    const [subjects, setSubjects] = useState<RowData[]>([]);
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState<RowData[]>([]);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [genderFilter, setGenderFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        axios.get('https://055d8281-4c59-4576-9474-9b4840b30078.mock.pstmn.io/subjects')
            .then(response => {
                setSubjects(response.data.data);
                setSortedData(response.data.data); // Initialize sortedData with fetched data
            })
            .catch(error => console.error("There was an error!", error));
    }, []);

    useEffect(() => {
        applyFiltersAndSorting();
    }, [search, sortBy, reverseSortDirection, genderFilter, statusFilter, subjects]);

    function applyFiltersAndSorting() {
        let filteredData = subjects;

        if (genderFilter) {
            filteredData = filteredData.filter(item => item.gender === genderFilter);
        }

        if (statusFilter) {
            filteredData = filteredData.filter(item => item.status === statusFilter);
        }

        filteredData = filterData(filteredData, search);

        const finalData = sortData(filteredData, { sortBy, reversed: reverseSortDirection, search });
        setSortedData(finalData);
    }

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(subjects, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(subjects, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = sortedData.map((row) => (
        <Table.Tr key={row.id}>
            <Table.Td style={{ borderBottom: '1px solid black', borderRight: '1px solid black', padding: '2px' }}>{row.name}</Table.Td>
            <Table.Td style={{ borderBottom: '1px solid black', borderRight: '1px solid black', padding: '2px' }}>{row.age}</Table.Td>
            <Table.Td style={{ borderBottom: '1px solid black', borderRight: '1px solid black', padding: '2px' }}>{row.gender}</Table.Td>
            <Table.Td style={{ borderBottom: '1px solid black', borderRight: '1px solid black', padding: '2px' }}>{new Date(row.diagnosisDate).toLocaleDateString()}</Table.Td>
            <Table.Td style={{ borderBottom: '1px solid black', borderRight: '1px solid black', padding: '2px' }}>{row.status}</Table.Td>
        </Table.Tr>
    ));

    return (
        <MantineProvider>
            <div style={{ paddingBottom: '16px', paddingTop: '16px' }}>
            <TextInput
                placeholder="Search by Name, Age, or Date"
                mb="md"
                label="Search Patient Data"
                // leftSection={<IconSearch />}
                value={search}
                styles={{
                    input: {
                        width: '360px'
                    }
                }}
                onChange={handleSearchChange}

            />
                </div>

            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

            <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed">
                <Table.Thead>
                    <Table.Tr>
                        <Th
                            sorted={sortBy === 'name'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('name')}
                        >
                            Name
                        </Th>
                        <Th
                            sorted={sortBy === 'age'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('age')}
                        >
                            Age
                        </Th>
                        <Th
                            sorted={sortBy === 'gender'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('gender')}
                        >
                            Gender
                        </Th>
                        <Th
                            sorted={sortBy === 'diagnosisDate'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('diagnosisDate')}
                        >
                            Diagnosis Date
                        </Th>
                        <Th
                            sorted={sortBy === 'status'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('status')}
                        >
                            Status
                        </Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.length > 0 ? rows : (
                        <Table.Tr>
                            <Table.Td colSpan={5}>
                                <Text fw={500} ta="center">
                                    Nothing found
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </MantineProvider>
    );
}

export default TableSort;
