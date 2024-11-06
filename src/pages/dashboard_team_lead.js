import React, { useState, useEffect } from 'react'; // Asegúrate de incluir useEffect aquí
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; // Importa el ícono de engranaje
import styles from '../styles/dashboard_TL.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useRouter } from 'next/router';


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
    const [dataRows, setDataRows] = useState();
    const [dataRows_Report, setDataRows_Report] = useState();
    const [TL_Technitians, setTL_Technitians] = useState([]);
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

        // Datos para el gráfico de producción individual
    const [individualData, setIndividualData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Cases per Technician',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

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


        const taskColors = [
            'rgba(66, 135, 245, 0.6)',  // Color para 'New Cases'
            'rgba(255, 166, 0, 0.6)',   // Color para 'Reworks'
            'rgba(231, 76, 60, 0.6)',   // Color para 'Team Lead Consult'
        ];
    
        // Estado para los datos del gráfico de tareas
        const [groupData, setGroupData] = useState({
            labels: [],
            datasets: [
                {
                    label: 'Tasks per Type',
                    data: [],
                    backgroundColor: taskColors,
                    borderColor: taskColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        });

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


       // Paleta de colores para los técnicos (elegantes y consistentes)
       const techColors_Idle_Time = [
        'rgba(75, 123, 139, 0.6)',  // Color para Tech #1
        'rgba(153, 102, 255, 0.6)', // Color para Tech #2
        'rgba(255, 159, 64, 0.6)',  // Color para Tech #3
        'rgba(54, 162, 235, 0.6)',  // Color para Tech #4
        'rgba(255, 206, 86, 0.6)',  // Color para Tech #5
        'rgba(105, 195, 140, 0.6)', // Color para Tech #6
        ];

        // Datos para el gráfico de producción individual
        const [individualData_Idle_Time, setIndividualData_Idle_Time] = useState({
            labels: [],
            datasets: [
                {
                    label: 'Cases per Technician',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1,
                },
            ],
        });

            // Opciones para el gráfico
            const current_Idle_Time_ChartOptions = {
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
            setSearchData(prev => ({ ...prev, [name]: value }));
        };

        const handleSearchSubmit = (e) => {
            e.preventDefault();
            alert(searchData.startDate +" / " + searchData.endDate + " / " + searchData.technician);

            if (searchData.startDate == "") { 
                showAlert('error', 'Error', 'Please select both Task and Type.');
                return;
            }
            if (searchData.endDate == "") { 
                showAlert('error', 'Error', 'Please select both Task and Type.');
                return;
            }
            
            fetchReports();
        };

        const handleModifyClick = (index) => {
            setIsEditing(true);
            setEditingIndex(index);
            setEditData(dataRows_Report[index]);
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
        
            // Validar que el alias tenga 5 caracteres si task es "Production"
            if (editData.task === "Production" && editData.alias.length !== 5) {
                showAlert('error', 'Error', 'Please, the alias must be 5 characters long.');
                return;
            }
        
            // Validar que el campo de comentarios no esté vacío si type es 'Other'
            if (editData.type === 'Other' && !editData.comments) {
                showAlert('error', 'Error', 'Please fill in the comments when selecting "Other".');
                return;
            }
        
            // Expresión regular para el formato "YYYY-MM-DD HH:MM:SS"
            const dateTimeFormat = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;

            // Validar que las fechas coincida con el formato
            if (!dateTimeFormat.test(editData.startTime)) {
                showAlert('error', 'Error', 'The start date must be in the format YYYY-MM-DD HH:MM:SS.');
                return;
            }

            if (!dateTimeFormat.test(editData.endTime)) {
                showAlert('error', 'Error', 'The end time must be in the format YYYY-MM-DD HH:MM:SS.');
                return;
            }

            // Convertir startTime y endTime a objetos Date para comparar
            const startTime = new Date(editData.startTime);
            const endTime = new Date(editData.endTime);

            // Verificar que startTime sea menor que endTime
            if (startTime >= endTime) {
                showAlert('error', 'Error', 'The start time must be earlier than the end time.');
                return;
            }

            // Actualizar el tableData con los nuevos datos
            const timeDifference = endTime - startTime; 
            const elapsedMinutes = Math.floor(timeDifference / 60000); // Convertir a minutos

            // Resetear alias si task no es "Production"
            const updatedData = {
                ...editData,
                alias: editData.task === "Production" ? editData.alias : "", 
                totalTime: `${elapsedMinutes} min`,
            };
            const newTableData = [...tableData];
            newTableData[editingIndex] = updatedData;
            setTableData(newTableData);
        
            // Resetear el estado de edición
            setIsEditing(false);
            setEditingIndex(null);
            setEditData({});
            setHighlightedRow(null);
            showAlert('success', 'Update', 'The register was updated successfully.');
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

        const fetchTechList = async () => {
        
            const tl = localStorage.getItem('user_name');
            try {
                const res = await fetch('/api/TL/manage_times', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tl_user_name: tl }), 
                });
                const data = await res.json();        
                if (data.success) {
                    setTL_Technitians(data.users);
                } else {
                    console.error('Error fetching types:', data.message);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        useEffect(() => {
            fetchTechList();
        },[]);
        /*
        useEffect(() => {
            // Obtener las opciones disponibles para `type` basado en el `role` y `task`
            const typeOptions = roll_available_Type_Options(editData.role, editData.task);

            // Si hay opciones disponibles, establecer el primer valor como `type` por defecto
            if (typeOptions.length > 0) {
                setEditData((prevState) => ({
                    ...prevState,
                    type: typeOptions[0].value,
                }));
            }
        }, [editData.task]);
*/


        const fetchReports = async () => {
            const user_id = searchData.technician;
            const startDate = searchData.startDate;
            const endDate = searchData.endDate;

            try {
                const response = await fetch('/api/TL/search_report', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id, startDate, endDate}),
                });                    
        
                const result = await response.json();
        
                if (result.success) {
                    const data = result.reports;
                    setDataRows_Report(data); 

                } else {
                    alert(result.message || "Error al actualizar la tabla.");
                }
            } catch (error) {
                console.error(error);
                alert("Error en la conexión.");
            }
        };

        useEffect(() => {
            if (TL_Technitians.length > 0) {
                setSearchData(prevData => ({ ...prevData, technician: TL_Technitians[0].id }));
            }
        }, [searchData.startDate, searchData.endDate]);


    //#endregion

    //#region Code for role managing

        /*********************************************************************************************/
        /***                    All The Validations needed for managing roles                      ***/
        /*********************************************************************************************/

            // Lista de técnicos
            const technicians = [
                "Tech #1", "Tech #2", "Tech #3", "Tech #4", 
                "Tech #5", "Tech #6", "Tech #7", "Tech #8", 
                "Tech #9", "Tech #10", "Tech #11", "Tech #12"
            ];

            // Estado para los roles de cada técnico
            const [roles, setRoles] = useState(
                technicians.map(name => ({
                    name,
                    OTP: true,
                    Clinical_Ops: false,
                    Clinical_Exc: false,
                    Ortho: false,
                    QC_OTP: false,
                    Detailer_Finisher: false,
                    Clinical_Analyst: false,
                    CAD: false,
                }))
            );

            // Manejar el cambio de checkbox para un técnico específico
            const handleCheckboxChange = (technicianIndex, role) => {
                const updatedRoles = [...roles];

                // Deseleccionar todos los roles de ese técnico
                Object.keys(updatedRoles[technicianIndex]).forEach(r => {
                    if (r !== 'name') updatedRoles[technicianIndex][r] = false;
                });

                // Seleccionar solo el rol actual
                updatedRoles[technicianIndex][role] = true;
                
                setRoles(updatedRoles);
            };

            // Manejar el cambio de checkbox del encabezado
            const handleHeaderCheckboxChange = (role) => {
                const updatedRoles = roles.map(tecnico => {
                    const newRoles = { ...tecnico };
                    
                    // Deseleccionar todos los roles de este técnico
                    Object.keys(newRoles).forEach(r => {
                        if (r !== 'name') newRoles[r] = false;
                    });

                    // Seleccionar el rol actual
                    newRoles[role] = true;
                    
                    return newRoles;
                });

                setRoles(updatedRoles);
            };

            // Guardar cambios
            const saveChanges = () => {
                console.log("Datos guardados:", roles);
                showAlert('success', 'Role Change', 'The role was updated successfully.');
            };

    //#endregion

    //#region Code for report

        /*********************************************************************************************/
        /***                             Report and data for grafics                               ***/
        /*********************************************************************************************/

        const fetchDailyReportsTl = async () => {
        const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' '); // Formato YYYY-MM-DD
        const tl_name = localStorage.getItem('user_name');
        try {
            const response = await fetch('/api/TL/report_tl', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tl_name, currentDate }),
            });

            const result = await response.json();

            if (result.success) {
                const data = result.reports;
                setDataRows(data);

                // Obtener nombres únicos y contar casos por cada técnico
                const uniqueUsers = Array.from(new Set(data.map(item => item.user_name)));
                const caseCounts = uniqueUsers.map(user => 
                    data.filter(item => item.user_name === user).length
                );

                // Crear datos dinámicos para el gráfico
                const dynamicIndividualData = {
                    labels: uniqueUsers,
                    datasets: [
                        {
                            label: 'Cases per Technician',
                            data: caseCounts,
                            backgroundColor: techColors.slice(0, uniqueUsers.length),
                            borderColor: techColors.slice(0, uniqueUsers.length).map(color => color.replace('0.6', '1')),
                            borderWidth: 1,
                        },
                    ],
                };
                setIndividualData(dynamicIndividualData);

                const uniqueType = Array.from(new Set(data.map(item => item.type_value)));
                const taskCounts = uniqueType.map(task =>
                    data.filter(item => item.type_value === task).length
                );

                // Crear datos dinámicos para el gráfico
                const dynamicGroupData = {
                    labels: uniqueType,
                    datasets: [
                        {
                            label: 'Tasks per Type',
                            data: taskCounts,
                            backgroundColor: taskColors.slice(0, uniqueType.length),
                            borderColor: taskColors.slice(0, uniqueType.length).map(color => color.replace('0.6', '1')),
                            borderWidth: 1,
                        },
                    ],
                };

                // Actualizar el estado del gráfico
                setGroupData(dynamicGroupData);


                // Sumar el tiempo total de "Idle_Time" para cada usuario
                const idleTimeCounts = uniqueUsers.map(user => {
                    // Filtrar registros que corresponden a "Idle_Time" y al usuario actual
                    const idleTimeRecords = data.filter(
                        item => item.user_name === user && item.task_name === "Idle_Time"
                    );

                    // Sumar el tiempo total para este usuario en "Idle_Time"
                    const totalIdleTime = idleTimeRecords.reduce((sum, record) => {
                        // Convertir total_time a número entero y sumar
                        return sum + parseInt(record.total_time, 10);
                    }, 0);

                    return totalIdleTime;
                });

                // Crear datos dinámicos para el gráfico
                const dynamicIndividualData_Idle_Time = {
                    labels: uniqueUsers,
                    datasets: [
                        {
                            label: 'Total Idle Time per Technician',
                            data: idleTimeCounts,
                            backgroundColor: techColors.slice(0, uniqueUsers.length),
                            borderColor: techColors.slice(0, uniqueUsers.length).map(color => color.replace('0.6', '1')),
                            borderWidth: 1,
                        },
                    ],
                };

                // Actualizar el estado del gráfico
                setIndividualData_Idle_Time(dynamicIndividualData_Idle_Time);

            } else {
                alert(result.message || "Error al actualizar la tabla.");
            }
        } catch (error) {
            console.error(error);
            alert("Error en la conexión.");
        }
    };
        
        useEffect(() => {
            fetchDailyReportsTl(); 
        }, []);

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

    //#region Code for login out

        /*********************************************************************************************/
        /***                                     Login Out                                         ***/
        /*********************************************************************************************/

        const router = useRouter(); // Create router instance

        const handleSignOut = () => {
            console.log('User signed out'); // Handle sign out logic if needed
            router.push('/'); // Redirect to the index page
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
                        <button
                            className={`${styles.signOutButton} ${showPasswordChangeForm ? styles.activeButton : ''}`}
                            onClick={handleSignOut}
                        >
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
                {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
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
                                <h2>Idle Time Report</h2>
                                <Bar data={individualData_Idle_Time} options={current_Idle_Time_ChartOptions} />
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
                                {Array.isArray(dataRows) && dataRows.length > 0 ? (
                                    dataRows.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.user_name}</td>
                                            <td>{row.task_name}</td>
                                            <td>{row.type_value}</td>
                                            <td>{row.alias}</td>
                                            <td>{row.commment}</td>
                                            <td>{row.row_status}</td>
                                            <td>{row.start_time}</td> 
                                            <td>{row.end_time}</td> 
                                            <td>{row.total_time + ' min'}</td> 
                                            <td>{row.role_name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No data available</td>
                                    </tr>
                                )}
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
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={searchData.startDate}
                                    onChange={handleSearchFormChange}
                                    className={styles.searchInput} 
                                />
                                <label htmlFor="endDate" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={searchData.endDate}
                                    onChange={handleSearchFormChange}
                                    className={styles.searchInput} 
                                />
                                <label htmlFor="technician" className={styles.searchLabel}> {/* Cambiado a htmlFor */}
                                    Select Technician
                                </label>

                                <select id="technician" name="type" value={searchData.technician} onChange={handleSearchFormChange} className={styles.searchInput}>
                                    {TL_Technitians.map(user => (
                                        <option key={user.id} value={String(user.id)}>
                                            {user.user_name}
                                        </option>
                                    ))}
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
                                {Array.isArray(dataRows_Report) && dataRows_Report.length > 0 ? (
                                    dataRows_Report.map((row, index) => (
                                        <tr
                                            key={index}
                                            style={{ backgroundColor: index === highlightedRow ? '#f0f8ff' : 'transparent' }} 
                                        >
                                            <td>{row.user_name}</td>
                                            <td>{row.task_name}</td>
                                            <td>{row.type_value}</td>
                                            <td>{row.alias}</td>
                                            <td>{row.commment}</td>
                                            <td>{row.row_status}</td>
                                            <td>{row.start_time}</td> 
                                            <td>{row.end_time}</td> 
                                            <td>{row.total_time + ' min'}</td> 
                                            <td>{row.role_name}</td>
                                            <td>
                                                <button onClick={() => handleModifyClick(index)}>Modify</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No data available</td>
                                    </tr>
                                )}
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
                                        value={editData.user_name}
                                        onChange={handleEditFormChange}
                                        placeholder="Technician"
                                        disabled
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <select 
                                        name="task"
                                        value={editData.task_name}
                                        onChange={handleEditFormChange}
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
                                        value={editData.type_value}
                                        onChange={handleEditFormChange}
                                        className={styles.editList} // Clase para los estilos
                                    >
                                        {roll_available_Type_Options(editData.role, editData.task).map((typeObj, index) => (
                                            <option key={index} value={typeObj.value}>
                                                {typeObj.label}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Mostrar alias solo si task es "Production" */}
                                    {editData.task_name === 'Production' && (
                                        <input 
                                            type="text"
                                            name="alias"
                                            value={editData.alias}
                                            onChange={handleEditFormChange}
                                            placeholder="Alias"
                                            className={styles.searchInput} // Clase para los estilos
                                        />
                                    )}
                                    <input 
                                        type="text"
                                        name="comments"
                                        value={editData.comments}
                                        onChange={handleEditFormChange}
                                        placeholder="Comments"
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <select 
                                        name="status" // Asegúrate de que el nombre sea "status" aquí
                                        value={editData.row_status}
                                        onChange={handleEditFormChange}
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
                                        value={editData.start_time}
                                        onChange={handleEditFormChange}
                                        placeholder="Start Time"
                                        required
                                        className={styles.searchInput} // Clase para los estilos
                                    />
                                    <input 
                                        type="text"
                                        name="endTime"
                                        value={editData.end_time}
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
                {selectedOption === 'Role Management' && !showPasswordChangeForm && (
                    <div id="container_roll" className={styles.container_roll}>
                    <h2>Role Management</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Técnico</th>
                                {['OTP', 'Clinical_Ops', 'Clinical_Exc', 'Ortho', 'QC_OTP', 'Detailer_Finisher', 'Clinical_Analyst', 'CAD'].map(role => (
                                    <th key={role}>
                                        <div style={{ textAlign: 'center' }}>
                                            {role}<br />
                                            <input 
                                                type="checkbox" 
                                                checked={roles.every(tecnico => tecnico[role])} 
                                                onChange={() => handleHeaderCheckboxChange(role)} 
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((tecnico, index) => (
                                <tr key={tecnico.name}>
                                    <td>{tecnico.name}</td>
                                    {['OTP', 'Clinical_Ops', 'Clinical_Exc', 'Ortho', 'QC_OTP', 'Detailer_Finisher', 'Clinical_Analyst', 'CAD'].map(role => (
                                        <td key={role}>
                                            <input 
                                                type="checkbox" 
                                                checked={tecnico[role]} 
                                                onChange={() => handleCheckboxChange(index, role)} 
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={saveChanges} className={styles.saveButton}>Save Changes</button>
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
