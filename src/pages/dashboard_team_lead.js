import React, { useState, useEffect } from 'react'; // Asegúrate de incluir useEffect aquí
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; // Importa el ícono de engranaje
import styles from '../styles/dashboard_TL.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


// Registrar componentes para el gráfico
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);
export default function Dashboard() {

    //#region States 
    /*********************************************************************************************/
    /***                                    state variables                                    ***/
    /*********************************************************************************************/
    const [selectedOption, setSelectedOption] = useState('Today Team Work');
    const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
    const [passwordChangeData, setPasswordChangeData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    // Estado para el Snackbar y la alerta
    const [alertConfig, setAlertConfig] = useState({
        open: false,
        severity: 'error', // 'success', 'info', 'warning', o 'error'
        title: 'Error',
        message: '',
    });
    //#endregion

    //#region Changes Events
    /*********************************************************************************************/
    /***                                    Changes Events                                     ***/
    /*********************************************************************************************/
    const handlePasswordChangeChange = (e) => {
        const { name, value } = e.target;
        setPasswordChangeData(prev => ({ ...prev, [name]: value }));
    };
    //#endregion

    //#region for Password changes

    /*********************************************************************************************/
    /***                                 Code for Change Password                              ***/
    /*********************************************************************************************/

    const handlePasswordChangeSubmit = (e) => {
        e.preventDefault();
        if (passwordChangeData.newPassword === passwordChangeData.confirmPassword) {
            // Lógica para cambiar la contraseña
            console.log('Password changed successfully');
            setPasswordChangeData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setShowPasswordChangeForm(false);
            setSelectedOption('Today Team Work');
        } else {
            console.log('New passwords do not match');
            showAlert('error', 'Password Change', 'New passwords do not match.');
        }
    };
    const handleOptionChange = (option) => {
        setSelectedOption(option);
        setShowPasswordChangeForm(false);
    };
    const handleSettingsButtonClick = () => {
        setShowPasswordChangeForm(prev => !prev);
        // Si el formulario ya está mostrado, selecciona "Today Team Work"
        if (showPasswordChangeForm) {
            setSelectedOption('Today Team Work');
        } else {
            setSelectedOption(''); // Limpiar opción al abrir el formulario de configuración
        }
    };
    //#endregion

    //#region Grafic Code

    /*********************************************************************************************/
    /***                                    Grafic Code                                        ***/
    /*********************************************************************************************/

       // Paleta de colores para los técnicos (elegantes y consistentes)
        const techColors = [
            'rgba(75, 123, 139, 0.6)',  // Color para Tech #1
            'rgba(153, 102, 255, 0.6)', // Color para Tech #2
            'rgba(255, 159, 64, 0.6)',  // Color para Tech #3
            'rgba(54, 162, 235, 0.6)',  // Color para Tech #4
            'rgba(255, 206, 86, 0.6)',  // Color para Tech #5
            'rgba(105, 195, 140, 0.6)', // Color para Tech #6
        ];

        // Datos para el gráfico de tipo de casos completados
        const groupData = {
            labels: ['New Cases', 'Reworks', 'Team Lead Consult'],
            datasets: [
                {
                    label: '',
                    data: [2, 4, 3],
                    backgroundColor: [
                        'rgba(66, 135, 245, 0.6)',  // Color nuevo para 'New Cases'
                        'rgba(255, 166, 0, 0.6)',   // Color nuevo para 'Reworks'
                        'rgba(231, 76, 60, 0.6)',   // Color nuevo para 'Team Lead Consult'
                    ],
                    borderColor: [
                        'rgba(66, 135, 245, 1)',
                        'rgba(255, 166, 0, 1)',
                        'rgba(231, 76, 60, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        // Opciones para el gráfico
        const group_ChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Current Production Report by Task',
                },
            },
        };

        // Datos para el gráfico de producción semanal
        const weeklyData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [
                {
                    label: 'Tech #1',
                    data: [1, 2, 3, 2, 1],
                    backgroundColor: techColors[0],
                    borderColor: techColors[0].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #2',
                    data: [2, 3, 1, 4, 2],
                    backgroundColor: techColors[1],
                    borderColor: techColors[1].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #3',
                    data: [3, 2, 4, 3, 5],
                    backgroundColor: techColors[2],
                    borderColor: techColors[2].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #4',
                    data: [1, 4, 2, 1, 3],
                    backgroundColor: techColors[3],
                    borderColor: techColors[3].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #5',
                    data: [2, 1, 3, 5, 2],
                    backgroundColor: techColors[4],
                    borderColor: techColors[4].replace('0.6', '1'),
                    borderWidth: 1,
                },
                {
                    label: 'Tech #6',
                    data: [4, 3, 2, 1, 4],
                    backgroundColor: techColors[5],
                    borderColor: techColors[5].replace('0.6', '1'),
                    borderWidth: 1,
                },
            ],
        };

        // Opciones para el gráfico
        const weeklyChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Weekly Production Report',
                },
            },
        };

        // Datos para el gráfico de producción individual
        const individualData = {
            labels: ['Tech #1', 'Tech #2', 'Tech #3', 'Tech #4', 'Tech #5', 'Tech #6'],
            datasets: [
                {
                    label: 'Cases per Technician',
                    data: [2, 4, 3, 4, 6, 4],
                    backgroundColor: techColors,
                    borderColor: techColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        };

        // Opciones para el gráfico
        const current_production_ChartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Current Production Report',
                },
            },
        };

    //#endregion

    //#region Values for type options according to task roll

        /*********************************************************************************************/
        /***                                 Type base on Roll                                     ***/
        /*********************************************************************************************/
        const typeOptions_OTP = {
            Production: [
                { value: 'New case', label: 'New case' },
                { value: 'Clinical rework', label: 'Clinical rework' },
                { value: 'QA rework', label: 'QA rework' },
                { value: 'Doctor rework', label: 'Doctor rework' },
                { value: 'QA review', label: 'QA review' },
                { value: 'Doctor rework review', label: 'Doctor rework review' },
                { value: 'Final MFG review', label: 'Final MFG review' },
            ],
            Call: [
                { value: 'Support from TL', label: 'Support from TL' },
                { value: 'Support from clinical', label: 'Support from clinical' },
                { value: 'Support from QA', label: 'Support from QA' },
                { value: 'Feedback from TL', label: 'Feedback from TL' },
                { value: 'Feedback from clinical', label: 'Feedback from clinical' },
                { value: 'Feedback from QA', label: 'Feedback from QA' },
            ],
            Meeting: [
                { value: 'OTP team huddle', label: 'OTP team huddle' },
                { value: 'Training', label: 'Training' },
                { value: '1:1', label: '1:1' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How its made', label: 'How its made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'UKR global stand-up', label: 'UKR global stand-up' },
                { value: 'UKR team', label: 'UKR team' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'Projects', label: 'Projects' },
                { value: 'Backup', label: 'Backup' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_Clinical_Ops = {
            Production: [
                { value: 'Full review', label: 'Full review' },
                { value: 'Second review', label: 'Second review' },
                { value: 'Doctor rework review', label: 'Doctor rework review' },
            ],
            Call: [
                { value: 'Clinical outreach', label: 'Clinical outreach' },
                { value: 'Support to OTP', label: 'Support to OTP' },
                { value: 'Support to QA', label: 'Support to QA' },
                { value: 'Feedback to OTP', label: 'Feedback to OTP' },
                { value: 'Feedback to QA', label: 'Feedback to QA' },
                { value: 'Internal support requested', label: 'Internal support requested' },
                { value: 'Internal support provided', label: 'Internal support provided' },
            ],
            Meeting: [
                { value: 'OTP team huddle', label: 'OTP team huddle' },
                { value: 'Clinical team huddle', label: 'Clinical team huddle' },
                { value: 'Clinical general meeting', label: 'Clinical general meeting' },
                { value: 'Training', label: 'Trainingnds' },
                { value: '1:1', label: '1:1' },
                { value: 'Lightplan review', label: 'Lightplan review' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'Internal assessment', label: 'Internal assessment' },
                { value: 'Reviews audit', label: 'Reviews audit' },
                { value: 'Clinical escalation', label: 'Clinical escalation' },
                { value: 'Infographics', label: 'Infographics' },
                { value: 'KB', label: 'KB' },
                { value: 'Low score', label: 'Low score' },
                { value: 'OTP rework audit', label: 'OTP rework audit' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Project', label: 'Project' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_Clinical_Exc = {
            Production: [
                { value: 'Full review', label: 'Full review' },
                { value: 'Second review', label: 'Second review' },
                { value: 'Doctor rework review', label: 'Doctor rework review' },
            ],
            Call: [
                { value: 'Clinical outreach', label: 'Clinical outreach' },
                { value: 'Support to OTP', label: 'Support to OTP' },
                { value: 'Support to QA', label: 'Support to QA' },
                { value: 'Feedback to OTP', label: 'Feedback to OTP' },
                { value: 'Feedback to QA', label: 'Feedback to QA' },
                { value: 'Internal support requested', label: 'Internal support requested' },
                { value: 'Internal support provided', label: 'Internal support provided' },
            ],
            Meeting: [
                { value: 'OTP team huddle', label: 'OTP team huddle' },
                { value: 'Clinical team huddle', label: 'Clinical team huddle' },
                { value: 'Clinical general meeting', label: 'Clinical general meeting' },
                { value: 'Training', label: 'Trainingnds' },
                { value: '1:1', label: '1:1' },
                { value: 'Lightplan review', label: 'Lightplan review' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'Internal assessment', label: 'Internal assessment' },
                { value: 'Reviews audit', label: 'Reviews audit' },
                { value: 'Clinical escalation', label: 'Clinical escalation' },
                { value: 'Infographics', label: 'Infographics' },
                { value: 'KB', label: 'KB' },
                { value: 'Low score', label: 'Low score' },
                { value: 'OTP rework audit', label: 'OTP rework audit' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Project', label: 'Project' },
                { value: 'Outreach IA', label: 'Outreach IA' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_Ortho = {
            Production: [
                { value: 'Full review', label: 'Full review' },
                { value: 'Second review', label: 'Second review' },
                { value: 'Doctor rework review', label: 'Doctor rework review' },
            ],
            Support: [
                { value: 'Support to CS', label: 'Support to CS' },
                { value: 'Support to OTP', label: 'Support to OTP' },
                { value: 'Support to QA', label: 'Support to QA' },
                { value: 'Support to OE', label: 'Support to OE' },
                { value: 'Support to clinical', label: 'Support to clinical' },
                { value: 'Internal assessment', label: 'Internal assessment' },
            ],
            Meeting: [
                { value: 'OE team huddle', label: 'OE team huddle' },
                { value: 'OTP team huddle', label: 'OTP team huddle' },
                { value: 'Clinical team huddle', label: 'Clinical team huddle' },
                { value: 'Training', label: 'Training' },
                { value: '1:1', label: '1:1' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'UKR global stand-up', label: 'UKR global stand-up' },
                { value: 'UKR team', label: 'UKR team' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'KB', label: 'KB' },
                { value: 'Project', label: 'Project' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_QC_OTP = {
            Production: [
                { value: 'QA review 1', label: 'QA review 1' },
                { value: 'QA review 2', label: 'QA review 2' },
                { value: 'QA review 3', label: 'QA review 3' },
                { value: 'MFG rework', label: 'MFG rework' },
                { value: 'Doctor rework 1', label: 'Doctor rework 1' },
                { value: 'Doctor rework 2', label: 'Doctor rework 2' },
                { value: 'Doctor rework 3', label: 'Doctor rework 3' },
                { value: 'Final MFG review', label: 'Final MFG review' },
            ],
            Call: [
                { value: 'Support to OTP', label: 'Support to OTP' },
                { value: 'Support from TL', label: 'Support from TL' },
                { value: 'Support from clinical', label: 'Support from clinical' },
            ],
            Meeting: [
                { value: 'OTP team huddle', label: 'OTP team huddle' },
                { value: 'QA team huddle', label: 'QA team huddle' },
                { value: 'Training', label: 'Trainingnds' },
                { value: '1:1', label: '1:1' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'Projects', label: 'Projects' },
                { value: 'Backup', label: 'Backup' },
                { value: 'Nesting revision', label: 'Nesting revision' },
                { value: 'Dr. communication', label: 'Dr. communication' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_Detailer_Finisher = {
            Production: [
                { value: 'Detailing', label: 'Detailing' },
                { value: 'Short Final MFG', label: 'Short Final MFG' },
                { value: 'Final MFG review', label: 'Final MFG review' },
                { value: 'Doctor rework', label: 'Doctor rework' },
            ],
            Call: [
                { value: 'Support from TL', label: 'Support from TL' },
                { value: 'Support from clinical', label: 'Support from clinical' },
                { value: 'RCF-Low Score from TL', label: 'RCF-Low Score from TL' },
            ],
            Meeting: [
                { value: 'Prism huddle', label: 'Prism huddle' },
                { value: 'Bi weekly Retrospective', label: 'Bi weekly Retrospective' },
                { value: 'Training', label: 'Trainingnds' },
                { value: '1:1', label: '1:1' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'Projects', label: 'Projects' },
                { value: 'Backup', label: 'Backup' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Audit', label: 'Audit' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for TL Assistance', label: 'Waiting for TL Assistance' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_Clinical_Analyst = {
            Production: [
                { value: 'Clinical Analysis', label: 'Clinical Analysis' },
                { value: 'Second Clinical Analysis', label: 'Second Clinical Analysis' },
            ],
            Call: [
                { value: 'Internal Support to PRISM', label: 'Internal Support to PRISM' },
                { value: 'Internal Support to TL PRISM', label: 'Internal Support to TL PRISM' },
                { value: 'Clinical Coordinator Support', label: 'Clinical Coordinator Support' },
                { value: 'Feedback to PRISM', label: 'Feedback to PRISM' },
            ],
            Meeting: [
                { value: 'Prism huddle', label: 'Prism huddle' },
                { value: 'Bi weekly Retrospective', label: 'Bi weekly Retrospective' },
                { value: 'Clinical team huddle', label: 'Clinical team huddle' },
                { value: 'Training', label: 'Trainingnds' },
                { value: '1:1', label: '1:1' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'IA Resolve', label: 'IA Resolve' },
                { value: 'Special Task', label: 'Special Task' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Project', label: 'Project' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_CAD = {
            Production: [
                { value: 'Segmentation', label: 'Segmentation' },
                { value: 'IDB design', label: 'IDB design' },
                { value: 'Segmentation review', label: 'Segmentation review' },
                { value: 'IDB review', label: 'IDB review' },
                { value: 'Final MFG review', label: 'Final MFG review' },
                { value: 'Order entry', label: 'Order entry' },
                { value: 'OE+segmentation', label: 'OE+segmentation' },
            ],
            Call: [
                { value: 'Support from TL', label: 'Support from TL' },
                { value: 'Support from QA', label: 'Support from QA' },
                { value: 'Feedback from TL', label: 'Feedback from TL' },
                { value: 'Feedback from QA', label: 'Feedback from QA' },
            ],
            Meeting: [
                { value: 'CAD team huddle', label: 'CAD team huddle' },
                { value: 'Training', label: 'Trainingnds' },
                { value: '1:1', label: '1:1' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'UKR global stand-up', label: 'UKR global stand-up' },
                { value: 'UKR team', label: 'UKR team' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'Projects', label: 'Projects' },
                { value: 'Backup', label: 'Backup' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Plating', label: 'Plating' },
                { value: 'Reorder', label: 'Reorder' },
                { value: 'Camera review', label: 'Camera review' },
                { value: 'Scan association', label: 'Scan association' },
                { value: 'Physical rework', label: 'Physical rework' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };
        const typeOptions_QC_CAD = {
            Production: [
                { value: 'Segmentation', label: 'Segmentation' },
                { value: 'IDB design', label: 'IDB design' },
                { value: 'Segmentation review', label: 'Segmentation review' },
                { value: 'IDB review', label: 'IDB review' },
                { value: 'Final MFG review', label: 'Final MFG review' },
                { value: 'Order entry', label: 'Order entry' },
            ],
            Call: [
                { value: 'Support to CAD', label: 'Support to CAD' },
                { value: 'Support from TL', label: 'Support from TL' },
                { value: 'Support from clinical', label: 'Support from clinical' },
            ],
            Meeting: [
                { value: 'QC-CAD team huddle', label: 'QC-CAD team huddle' },
                { value: 'Training', label: 'Trainingnds' },
                { value: '1:1', label: '1:1' },
                { value: 'Monthly all hands', label: 'Monthly all hands' },
                { value: 'How it´s made', label: 'How it´s made' },
                { value: 'Coffee talk', label: 'Coffee talk' },
                { value: 'CR town hall', label: 'CR town hall' },
                { value: 'UKR global stand-up', label: 'UKR global stand-up' },
                { value: 'UKR team', label: 'UKR team' },
                { value: 'Other', label: 'Other' },
            ],
            Other_Task: [
                { value: 'Projects', label: 'Projects' },
                { value: 'Backup', label: 'Backup' },
                { value: 'Certification', label: 'Certification' },
                { value: 'Mentoring', label: 'Mentoring' },
                { value: 'Scan association', label: 'Scan association' },
                { value: 'Internal assessment', label: 'Internal assessment' },
                { value: 'Treatment notes', label: 'Treatment notes' },
                { value: 'Salesforce', label: 'Salesforce' },
                { value: 'Segment. review', label: 'Segment. review' },
                { value: 'IDB review', label: 'IDB review' },
                { value: 'Plating review', label: 'Plating review' },
                { value: 'Camera review', label: 'Camera review' },
                { value: 'OSO', label: 'OSO' },
                { value: 'Other', label: 'Other' },
            ],
            Idle_Time: [
                { value: 'Waiting for case', label: 'Waiting for case' },
                { value: 'Waiting for support', label: 'Waiting for support' },
                { value: 'Electricity problem', label: 'Electricity problem' },
                { value: 'Internet problem', label: 'Internet problem' },
                { value: 'Lunch', label: 'Lunch' },
                { value: 'Break', label: 'Break' },
                { value: 'Reposition', label: 'Reposition' },
                { value: 'Personal needs', label: 'Personal needs' },
                { value: 'Other', label: 'Other' },
            ],
        };

        function roll_available_Type_Options(userRole,userTask){
            switch (userRole) {
                case "OTP":
                    return typeOptions_OTP[userTask];  
                case "Clinical_Ops":
                    return typeOptions_Clinical_Ops[userTask];  
                case "Clinical_Exc":
                    return typeOptions_Clinical_Exc[userTask]; 
                case "Ortho":
                    return typeOptions_Ortho[userTask];  
                case "QC_OTP":
                    return typeOptions_QC_OTP[userTask];  
                case "Detailer_Finisher":
                    return typeOptions_Detailer_Finisher[userTask]; 
                case "Clinical_Analyst":
                    return typeOptions_Clinical_Analyst[userTask];    
                case "CAD":
                    return typeOptions_CAD[userTask];    
                case "QC_OTP":
                    return typeOptions_QC_CAD[userTask];  
                default:
                    return [];
            }
        }
    //#endregion

    //#region Code for Manage Times section

    /*********************************************************************************************/
    /***                  All The Validations needed for Manage Times section                  ***/
    /*********************************************************************************************/

        const [searchData, setSearchData] = useState({
            startDate: '',
            endDate: '',
            technician: '',
        });
        const [highlightedRow, setHighlightedRow] = useState(null);
        const [tableData, setTableData] = useState([]);
        const [isEditing, setIsEditing] = useState(false);
        const [editingIndex, setEditingIndex] = useState(null);
        const [editData, setEditData] = useState({});
        
        // Opciones de Task basadas en el rol
        const taskOptionsByRole = {
            OTP: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            Clinical_Ops: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            Clinical_Exc: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            Ortho: ['Production', 'Support', 'Meeting', 'Other Task', 'Idle_Time'],
            QC_OTP: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            Detailer_Finisher: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            Clinical_Analyst: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            CAD: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
        };

        const handleSearchFormChange = (e) => {
            const { name, value } = e.target;
            setSearchData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };

        const handleSearchSubmit = (e) => {
            e.preventDefault();
            const newEntry = {
                technician: "Niels Morales",
                task: 'Production', // Cambia a un valor real más tarde
                type: 'Second review',
                alias: '12345',
                comments: 'Comments Example',
                status: 'Finished',
                startTime: '09:00 AM',
                endTime: '10:00 AM',
                totalTime: '1 hour',
                role: 'Clinical_Ops', // Cambia a un valor real más tarde
            };
            setTableData((prevData) => [...prevData, newEntry]);
            setSearchData({
                startDate: '',
                endDate: '',
                technician: '',
            });
        };

        const handleModifyClick = (index) => {
            setIsEditing(true);
            setEditingIndex(index);
            setEditData(tableData[index]);
            setHighlightedRow(index); // Establece el índice de la fila seleccionada
        };

        const handleEditFormChange = (e) => {
            const { name, value } = e.target;
            setEditData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };

        const handleEditSubmit = (e) => {
            e.preventDefault();
            const updatedData = [...tableData];
            updatedData[editingIndex] = editData;
            setTableData(updatedData);
            setIsEditing(false);
            setEditingIndex(null);
            setEditData({});
            setHighlightedRow(null);
        };
        const handleCancelClick = () => {
            setIsEditing(false); // Oculta el formulario al hacer clic en "Cancel"
            setHighlightedRow(null);
        };

        // Obtener las opciones de tarea para el rol seleccionado
        const getTaskOptions = (role) => {
            return taskOptionsByRole[role] || [];
        };
        const getStatusOptions = () => {
            return ['Finished', 'Stop'] || [];
        };
    //#endregion

    //#region Code for alert messagess

    /*********************************************************************************************/
    /***                                   Alert Messages                                      ***/
    /*********************************************************************************************/

    // Función para abrir el Snackbar
    const showAlert = (severity, title, message) => {
        setAlertConfig({ open: true, severity, title, message });
    };

    // Función para cerrar el Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return; // Evita el cierre accidental
        setAlertConfig({ ...alertConfig, open: false });
    };
    //#endregion

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.leftOptions}>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Today Team Work' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Today Team Work')}
                        >
                            Today's Teamwork
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Manage Times' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Manage Times')}
                        >
                            Manage Times
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Role Management' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Role Management')}
                        >
                            Role Management
                        </button>
                    </div>
                    <div className={styles.rightOptions}>
                        <button className={`${styles.signOutButton} ${showPasswordChangeForm ? styles.activeButton : ''}`} onClick={() => console.log('User signed out')}>
                            Sign Out
                        </button>
                        <button
                            className={`${styles.settingsButton} ${showPasswordChangeForm ? styles.activeButton : ''}`}
                            onClick={handleSettingsButtonClick}
                        >
                            <FaCog />
                        </button>
                    </div>
                </nav>
            </header>
            <main className={styles.content}>
                {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
                        {/* Snackbar para mostrar el mensaje de alerta */}
                        <Snackbar
                            open={alertConfig.open}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert onClose={handleClose} severity={alertConfig.severity} variant="filled">
                                <AlertTitle>{alertConfig.title}</AlertTitle>
                                {alertConfig.message}
                            </Alert>
                        </Snackbar>
                        <div className={styles.formSection}>

                        {/* Weekly Production Section */}
                        <div className={styles.timerSection}>
                            <h2>Current Individual Production</h2>
                            <Bar data={individualData} options={current_production_ChartOptions} />
                        </div>
                        </div>
                        <div className={styles.chartSection}>
                            <h2>Current Production Report by Task</h2>
                            <Bar data={groupData} options={group_ChartOptions} />
                        </div>
                        {/* Weekly Production Section */}
                        <div className={styles.timerSection}>
                            {/* Weekly Production Section */}
                            <div className={styles.timerSection}>
                                <h2>Weekly Production Report</h2>
                                <Bar data={weeklyData} options={weeklyChartOptions} />
                            </div>
                        </div>
                        
                    </div>
                )}
                {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Technician</th>
                                    <th>Task</th>
                                    <th>Type</th>
                                    <th>Alias</th>
                                    <th>Comments</th>
                                    <th>Status</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Total Time</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Tech #1</td>
                                    <td>Install Brackets</td>
                                    <td>New Case</td>
                                    <td>Patient_A1</td>
                                    <td>N/A</td>
                                    <td>Completed</td>
                                    <td>08:00</td>
                                    <td>09:30</td>
                                    <td>1h 30m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #2</td>
                                    <td>Adjustment</td>
                                    <td>Rework</td>
                                    <td>Patient_B2</td>
                                    <td>Replaced bands</td>
                                    <td>In Progress</td>
                                    <td>10:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #3</td>
                                    <td>Initial Consultation</td>
                                    <td>Team Lead Consult</td>
                                    <td>Patient_C3</td>
                                    <td>Discussed treatment options</td>
                                    <td>Completed</td>
                                    <td>11:00</td>
                                    <td>11:45</td>
                                    <td>45m</td>
                                    <td>Team Lead</td>
                                </tr>
                                <tr>
                                    <td>Tech #4</td>
                                    <td>Retainer Check</td>
                                    <td>Rework</td>
                                    <td>Patient_D4</td>
                                    <td>Adjusted fit</td>
                                    <td>Pending</td>
                                    <td>12:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #5</td>
                                    <td>Bracket Removal</td>
                                    <td>New Case</td>
                                    <td>Patient_E5</td>
                                    <td>Final phase</td>
                                    <td>Completed</td>
                                    <td>13:30</td>
                                    <td>14:15</td>
                                    <td>45m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #6</td>
                                    <td>Follow-up</td>
                                    <td>Rework</td>
                                    <td>Patient_F6</td>
                                    <td>Minor adjustments needed</td>
                                    <td>In Progress</td>
                                    <td>15:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #1</td>
                                    <td>Install Brackets</td>
                                    <td>New Case</td>
                                    <td>Patient_A1</td>
                                    <td>N/A</td>
                                    <td>Completed</td>
                                    <td>08:00</td>
                                    <td>09:30</td>
                                    <td>1h 30m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #2</td>
                                    <td>Adjustment</td>
                                    <td>Rework</td>
                                    <td>Patient_B2</td>
                                    <td>Replaced bands</td>
                                    <td>In Progress</td>
                                    <td>10:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #3</td>
                                    <td>Initial Consultation</td>
                                    <td>Team Lead Consult</td>
                                    <td>Patient_C3</td>
                                    <td>Discussed treatment options</td>
                                    <td>Completed</td>
                                    <td>11:00</td>
                                    <td>11:45</td>
                                    <td>45m</td>
                                    <td>Team Lead</td>
                                </tr>
                                <tr>
                                    <td>Tech #4</td>
                                    <td>Retainer Check</td>
                                    <td>Rework</td>
                                    <td>Patient_D4</td>
                                    <td>Adjusted fit</td>
                                    <td>Pending</td>
                                    <td>12:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #5</td>
                                    <td>Bracket Removal</td>
                                    <td>New Case</td>
                                    <td>Patient_E5</td>
                                    <td>Final phase</td>
                                    <td>Completed</td>
                                    <td>13:30</td>
                                    <td>14:15</td>
                                    <td>45m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #6</td>
                                    <td>Follow-up</td>
                                    <td>Rework</td>
                                    <td>Patient_F6</td>
                                    <td>Minor adjustments needed</td>
                                    <td>In Progress</td>
                                    <td>15:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #1</td>
                                    <td>Install Brackets</td>
                                    <td>New Case</td>
                                    <td>Patient_A1</td>
                                    <td>N/A</td>
                                    <td>Completed</td>
                                    <td>08:00</td>
                                    <td>09:30</td>
                                    <td>1h 30m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #2</td>
                                    <td>Adjustment</td>
                                    <td>Rework</td>
                                    <td>Patient_B2</td>
                                    <td>Replaced bands</td>
                                    <td>In Progress</td>
                                    <td>10:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #3</td>
                                    <td>Initial Consultation</td>
                                    <td>Team Lead Consult</td>
                                    <td>Patient_C3</td>
                                    <td>Discussed treatment options</td>
                                    <td>Completed</td>
                                    <td>11:00</td>
                                    <td>11:45</td>
                                    <td>45m</td>
                                    <td>Team Lead</td>
                                </tr>
                                <tr>
                                    <td>Tech #4</td>
                                    <td>Retainer Check</td>
                                    <td>Rework</td>
                                    <td>Patient_D4</td>
                                    <td>Adjusted fit</td>
                                    <td>Pending</td>
                                    <td>12:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #5</td>
                                    <td>Bracket Removal</td>
                                    <td>New Case</td>
                                    <td>Patient_E5</td>
                                    <td>Final phase</td>
                                    <td>Completed</td>
                                    <td>13:30</td>
                                    <td>14:15</td>
                                    <td>45m</td>
                                    <td>Technician</td>
                                </tr>
                                <tr>
                                    <td>Tech #6</td>
                                    <td>Follow-up</td>
                                    <td>Rework</td>
                                    <td>Patient_F6</td>
                                    <td>Minor adjustments needed</td>
                                    <td>In Progress</td>
                                    <td>15:00</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Technician</td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                )}
                {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
                    <div className={styles.container_searchForm}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                            <div className={styles.searchForm}> {/* Cambiado a className */}
                                <label htmlFor="startDate" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    Start Date
                                </label>
                                <input type="date" id="startDate" className={styles.searchInput} />

                                <label htmlFor="endDate" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    End Date
                                </label>
                                <input type="date" id="endDate" className={styles.searchInput} />

                                <label htmlFor="technician" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    Select Technician
                                </label>
                                <select id="technician" className={styles.searchInput}>
                                    <option value="">Select Technician</option>
                                    <option value="technician1">Technician 1</option>
                                    <option value="technician2">Technician 2</option>
                                    <option value="technician3">Technician 3</option>
                                </select>
                                <button type="submit" className={styles.searchButton}>Search</button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Tabla con los campos especificados */}
                {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
                    <div className={styles.container}>
                        <div className={`${styles.tableContainer} ${isEditing ? styles.shrinkTable : ''}`}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Technician</th>
                                        <th>Task</th>
                                        <th>Type</th>
                                        <th>Alias</th>
                                        <th>Comments</th>
                                        <th>Status</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Total Time</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
    {tableData.map((entry, index) => (
        <tr
            key={index}
            style={{ backgroundColor: index === highlightedRow ? '#f0f8ff' : 'transparent' }} // Cambia el color según la fila seleccionada
        >
            <td>{entry.technician}</td>
            <td>{entry.task}</td>
            <td>{entry.type}</td>
            <td>{entry.alias}</td>
            <td>{entry.comments}</td>
            <td>{entry.status}</td>
            <td>{entry.startTime}</td>
            <td>{entry.endTime}</td>
            <td>{entry.totalTime}</td>
            <td>{entry.role}</td>
            <td>
                <button onClick={() => handleModifyClick(index)}>Modify</button>
            </td>
        </tr>
    ))}
</tbody>
                            </table>
                        </div>

                        {isEditing && (
                            <div className={styles.editFormContainer}> 
                                <form onSubmit={handleEditSubmit}>
                                    <h3>Edit Row</h3>
                                    <input 
                                        type="text"
                                        name="technician"
                                        value={editData.technician}
                                        onChange={handleEditFormChange}
                                        placeholder="Technician"
                                        disabled
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <select 
                                        name="task"
                                        value={editData.task}
                                        onChange={handleEditFormChange}
                                        required
                                        className={styles.editList} // Clase para los estilos
                                    >
                                        {getTaskOptions(editData.role).map((task, index) => (
                                            <option key={index} value={task}>
                                                {task}
                                            </option>
                                        ))}
                                    </select>
                                    <select 
                                        name="type"
                                        value={editData.type}
                                        onChange={handleEditFormChange}
                                        required
                                        className={styles.editList} // Clase para los estilos
                                    >
                                        {roll_available_Type_Options(editData.role, editData.task).map((typeObj, index) => (
                                            <option key={index} value={typeObj.value}>
                                                {typeObj.label}
                                            </option>
                                        ))}
                                    </select>
                                    <input 
                                        type="text"
                                        name="alias"
                                        value={editData.alias}
                                        onChange={handleEditFormChange}
                                        placeholder="Alias"
                                        required
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <input 
                                        type="text"
                                        name="comments"
                                        value={editData.comments}
                                        onChange={handleEditFormChange}
                                        placeholder="Comments"
                                        required
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <select 
                                        name="status" // Asegúrate de que el nombre sea "status" aquí
                                        value={editData.status}
                                        onChange={handleEditFormChange}
                                        required
                                        className={styles.editList} // Clase para los estilos
                                    >
                                        {getStatusOptions().map((typeObj, index) => (
                                            <option key={index} value={typeObj}>
                                                {typeObj}
                                            </option>
                                        ))}
                                    </select>
                                    <input 
                                        type="text"
                                        name="startTime"
                                        value={editData.startTime}
                                        onChange={handleEditFormChange}
                                        placeholder="Start Time"
                                        required
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <input 
                                        type="text"
                                        name="endTime"
                                        value={editData.endTime}
                                        onChange={handleEditFormChange}
                                        placeholder="End Time"
                                        required
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <button type="submit" className={styles.editButton}>Save Changes</button> {/* Clase para los estilos */}
                                    <button type="button" onClick={handleCancelClick} className={styles.cancel_Edit_Button}>Cancel</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {showPasswordChangeForm && (
                    <div className={styles.changePasswordForm}>
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChangeSubmit}>
                            <div>
                                <label>Old Password:</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordChangeData.oldPassword}
                                    onChange={handlePasswordChangeChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordChangeData.newPassword}
                                    onChange={handlePasswordChangeChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordChangeData.confirmPassword}
                                    onChange={handlePasswordChangeChange}
                                    required
                                />
                            </div>
                            <button className={styles.submitButton_reset} type="submit">Change Password</button>
                            <button className={styles.cancelButton} type="button" onClick={() => setShowPasswordChangeForm(false)}>Cancel</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
