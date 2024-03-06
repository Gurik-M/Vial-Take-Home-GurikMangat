import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FilterableTable() {
    const [subjects, setSubjects] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        axios.get('https://055d8281-4c59-4576-9474-9b4840b30078.mock.pstmn.io/subjects')
            .then(response => {
                setSubjects(response.data.data);
            })
            .catch(error => console.error("There was an error!", error));
    }, []);

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Filter by name..."
                className="mb-4 p-2 border border-gray-300 rounded"
                onChange={e => setFilter(e.target.value)}
            />
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diagnosis Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubjects.map((subject, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {subject.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {subject.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(subject.diagnosisDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {subject.status}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default FilterableTable;
