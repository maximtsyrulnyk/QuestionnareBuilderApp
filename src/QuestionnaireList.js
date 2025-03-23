import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionnaireList = () => {
    const [questionnaires, setQuestionnaires] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/questionnaires')
            .then(response => setQuestionnaires(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Questionnaires</h1>
            <ul>
                {questionnaires.map(q => (
                    <li key={q.id}>{q.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionnaireList;
