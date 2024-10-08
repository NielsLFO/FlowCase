import React, { useState, useEffect } from 'react'; // Asegúrate de incluir useEffect aquí
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; // Importa el ícono de engranaje
import styles from '../styles/dashboard.module.css';
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
            const [selectedOption, setSelectedOption] = useState('Today Work');
            const [formData, setFormData] = useState({
                task: 'Production',
                type: 'New case',
                alias: '',
                comments: '',
                status: 'Started',
            });
            const [dataRows, setDataRows] = useState([]);
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
            const handleFormChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
            };
            const handlePasswordChangeChange = (e) => {
                const { name, value } = e.target;
                setPasswordChangeData(prev => ({ ...prev, [name]: value }));
            };
    //#endregion

    //#region Roll code

        /*********************************************************************************************/
        /***                                        Roll                                           ***/
        /*********************************************************************************************/

        const roleFromDatabase = 'Clinical_Ops'; // Aquí puedes cambiar manualmente para simular roles ** No cambiar de roll hasta que el ultimo registro se haya cerrado crear validacion para esto 


        // Estado para el rol que será obtenido de la base de datos
        const [userRole, setUserRole] = useState(roleFromDatabase);

        // Opciones de Task basadas en el rol
        const taskOptionsByRole = {
            OTP: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            Clinical_Ops: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'], 
            Clinical_Exc: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],
            Ortho: ['Production', 'Support', 'Meeting', 'Other task', 'Idle_Time'], 
            QC_OTP: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],  
            Detailer_Finisher: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],  
            Clinical_Analyst: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],  
            CAD: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],  
            QC_OTP: ['Production', 'Call', 'Meeting', 'Other_Task', 'Idle_Time'],  
 
        };

        // Obtener las opciones de "Task" basadas en el rol actual del usuario
        const availableTaskOptions = taskOptionsByRole[userRole] || [];

        // Efecto para actualizar el rol cuando cambie la variable de rol simulada
        const checkAndUpdateRole = () => {
            const lastRowIndex = dataRows.length - 1; // Índice de la última fila
            const lastRow = dataRows[lastRowIndex];   
            if (dataRows.length > 0) {
                if (userRole !== roleFromDatabase && (lastRow.status === 'Stop' || lastRow.status === 'Finished')) {
                    setUserRole(roleFromDatabase);
                    showAlert('warning', 'Role Changed', "Please be advised that your Team Lead has changed your user role. You will now be working in the following role: " + roleFromDatabase);
                }
            } else {
                setUserRole(roleFromDatabase);
            }
        };
        // Efecto para actualizar el rol cuando cambie la variable roleFromDatabase
        useEffect(() => {
            checkAndUpdateRole();
        }, [dataRows]);
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
            const availableTypeOptions = roll_available_Type_Options(); // Obtener las opciones de "Type" basadas en la tarea 

            function roll_available_Type_Options(){
                switch (userRole) {
                    case "OTP":
                        return typeOptions_OTP[formData.task];  
                    case "Clinical_Ops":
                        return typeOptions_Clinical_Ops[formData.task];  
                    case "Clinical_Exc":
                        return typeOptions_Clinical_Exc[formData.task]; 
                    case "Ortho":
                        return typeOptions_Ortho[formData.task];  
                    case "QC_OTP":
                        return typeOptions_QC_OTP[formData.task];  
                    case "Detailer_Finisher":
                        return typeOptions_Detailer_Finisher[formData.task]; 
                    case "Clinical_Analyst":
                        return typeOptions_Clinical_Analyst[formData.task];    
                    case "CAD":
                        return typeOptions_CAD[formData.task];    
                    case "QC_OTP":
                        return typeOptions_QC_CAD[formData.task];  
                    default:
                        return [];
                }
            }
    //#endregion

    //#region FormSubmit code 

        /*********************************************************************************************/
        /***               All The Validations needed for FormSubmit Baase on Rolls                ***/
        /*********************************************************************************************/
            const handleFormSubmit = (e) => {
                e.preventDefault();
                if (!formData.task || !formData.type) { // Validar que se hayan seleccionado Task y Type
                    showAlert('error', 'Error','Please select both Task and Type.');
                    return;
                }
                if (formData.type === 'Other' && !formData.comments) { // Validar que si Type es 'Other', el campo de comentarios no esté vacío
                    showAlert('error', 'Error','Please fill in the comments when selecting "Other".');
                    return;
                }             
                if (formData.task === "Production" && formData.alias.length !== 5) { // Validar que el alias tenga 5 caracteres
                    showAlert('error', 'Error', 'Please, the alias must be 5 characters long.');
                    return;
                }  
                const addNewRow = () => {
                    setDataRows(prev => [...prev, {...formData, start_time: currentTime, end_time: "00:00:00", total_time: "00:00:00", roll: userRole}]);
                    setFormData({
                        task: formData.task,
                        type: formData.type,
                        alias: formData.alias,
                        comments: formData.comments,
                        status: 'Finished',
                    });
                };  
                const currentTime = getCurrentDateTime(); // Obtener la hora actual
                if (dataRows.length > 0) { // Verificar si hay filas de datos
                    const lastRowIndex = dataRows.length - 1; // Índice de la última fila
                    const lastRow = dataRows[lastRowIndex]; 
                    if (lastRow.status === 'Started') { 
                        if (lastRow.alias !== formData.alias) {
                            showAlert('error', 'Error','You must complete the previous task before adding a new one.');
                            return;
                        } else if (lastRow.task === formData.task && lastRow.type === formData.type && lastRow.alias === formData.alias && (formData.status === 'Stop' || formData.status === 'Finished')) {
                            // Mantener el start time original
                            const startTime = new Date(lastRow.start_time); // start_time debe tener fecha y hora en formato "YYYY-MM-DD HH:MM:SS"
                            const endTime = new Date(); 
                            const timeDifference = endTime - startTime; 
                            const elapsedMinutes = Math.floor(timeDifference / 60000); // Convertir a minutos
                            // Actualizar la fila con el nuevo status y end time
                            const updatedRow = {
                                ...lastRow,
                                comments: formData.comments,
                                status: formData.status,
                                end_time: currentTime,
                                total_time: `${elapsedMinutes} min`, 
                                roll:userRole,
                            };
                            // Actualizar el estado de las filas de datos
                            const updatedDataRows = [...dataRows];
                            updatedDataRows[lastRowIndex] = updatedRow; // Usar el índice para actualizar la fila
                            setDataRows(updatedDataRows);
                            showAlert('success', 'Task', 'Your last task was updated successfully.');
                            // Limpiar el formulario después de agregar el registro
                            setFormData({
                                task: 'Production',
                                type: 'New case',
                                alias: '',
                                comments: '',
                                status: 'Started', //////mañana crear el seteo de los formularios segun los roles 
                            });
                        }
                    }else{
                        addNewRow();                
                    }
                }else{
                    addNewRow();
                };
            };
            function getCurrentDateTime() {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Enero es 0
                const day = String(currentDate.getDate()).padStart(2, '0');
                const hours = String(currentDate.getHours()).padStart(2, '0');
                const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                const seconds = String(currentDate.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }
            const getStatusOptions = () => {// Función para obtener las opciones dinámicas de estado
                if (dataRows.length > 0) {
                    const lastStatus = dataRows[dataRows.length - 1].status;
                    if (lastStatus === 'Started') {
                        return ['Finished', 'Stop'];
                    } else if (lastStatus === 'Stop' || lastStatus === 'Finished') {
                        return ['Started'];
                    }
                }
                return ['Started'];
            };
            const availableStatusOptions = getStatusOptions();
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
                    setSelectedOption('Today Work');
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
                // Si el formulario ya está mostrado, selecciona "Today Work"
                if (showPasswordChangeForm) {
                    setSelectedOption('Today Work');
                } else {
                    setSelectedOption(''); // Limpiar opción al abrir el formulario de configuración
                }
            };
    //#endregion

    //#region Grafic Code

        /*********************************************************************************************/
        /***                                    Grafic Code                                        ***/
        /*********************************************************************************************/
        const targetCases = 6;
        const completedCases = dataRows.filter(row => 
            row.task === 'Production' && 
            row.type === 'New case' && 
            row.alias.trim() !== '' &&
            row.status === "Finished"
        ).length;   
        const chartData = {
            labels: ['Cases Completed'],
            datasets: [
                {
                    label: 'Cases Completed',
                    data: [completedCases],
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    barThickness: 160,
                },
            ],
        };
        const chartOptions = {
            responsive: true,
            scales: {
                x: {beginAtZero: true, ticks: {stepSize: 1,}},
                y: {beginAtZero: true, ticks: {stepSize: 1,},
                    grid: {display: true, drawBorder: true,
                    color: '#e0e0e0', },// Color para las líneas de la cuadrícula
                    afterDataLimits: function(scale) {scale.max = Math.max(targetCases, completedCases);}
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            borderColor: '#ff0000',
                            borderWidth: 4,
                            label: {
                                content: 'Target: 6',
                                enabled: true,
                                position: 'top'
                            },
                            scaleID: 'y',
                            value: targetCases,
                            borderDash: [2, 2]
                        }
                    }
                }
            }
        };

        // Datos para el gráfico de producción semanal
        const weeklyData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [
                {
                    label: 'Cases per Day',
                    data: [2, 4, 3, 4, 6], 
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
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
                    display: true,
                    text: 'Weekly Production Report',
                },
            },
        };
    //#endregion

    //#region Code for history section

        /*********************************************************************************************/
        /***                  All The Validations needed for History section                       ***/
        /*********************************************************************************************/

            const [searchData, setSearchData] = useState({
                startDate: '',
                endDate: '',
            });

            // Función para manejar los cambios en el formulario de búsqueda
            const handleSearchFormChange = (e) => {
                const { name, value } = e.target;
                setSearchData(prev => ({ ...prev, [name]: value }));
            };

            // Función para manejar la búsqueda (aún sin funcionalidad)
            const handleSearchSubmit = (e) => {
                e.preventDefault();
                // Aquí puedes agregar la lógica para realizar la búsqueda
                console.log('Searching from', searchData.startDate, 'to', searchData.endDate);
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
                            className={`${styles.optionButton} ${selectedOption === 'Today Work' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Today Work')}
                        >
                            Today Work
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'History' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('History')}
                        >
                            History
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
                {selectedOption === 'Today Work' && !showPasswordChangeForm && (
                    <div className={styles.mainContent}>
                        <div className={styles.formSection}>
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
                            <form onSubmit={handleFormSubmit}>
                                <div>
                                    <h2>Case Flow</h2>
                                    <label>Task:</label>
                                    <select name="task" value={formData.task} onChange={handleFormChange}>
                                        <option value="">Select Task</option>
                                        {availableTaskOptions.map(task => (
                                            <option key={task} value={task}>
                                                {task}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Type:</label>
                                    <select name="type" value={formData.type} onChange={handleFormChange} disabled={!formData.task}>
                                        <option value="">Select Type</option>
                                        {availableTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    {/* Mostrar alias solo si task es "Production" */}
                                    {formData.task === 'Production' && (
                                        <>
                                            <label htmlFor="alias" className={styles.label}>Alias:</label>
                                            <input type="text" name="alias" id="alias" value={formData.alias} onChange={handleFormChange} className={styles.input} />
                                        </>
                                    )}
                                </div>
                                <div>
                                    <label>Comments:</label>
                                    <textarea name="comments" value={formData.comments} onChange={handleFormChange} />
                                </div>
                                <div>
                                    <label htmlFor="status" className={styles.label}>Status:</label>
                                    <select name="status" id="status" value={formData.status} onChange={handleFormChange} className={styles.input}>
                                        {availableStatusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className={styles.submitButton} type="submit">Add Register</button>
                            </form>
                        </div>
                        <div className={styles.chartSection}>
                            <h2>Production Report</h2>
                            <p>Total cases: {completedCases} / {targetCases}</p>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                        {/* Weekly Production Section */}
                        <div className={styles.timerSection}>
                            {/* Weekly Production Section */}
                            <div className={styles.timerSection}>
                                <h2>Weekly Production</h2>
                                <Bar data={weeklyData} options={weeklyChartOptions} />
                            </div>
                        </div>
                    </div>
                )}
                {selectedOption === 'History' && !showPasswordChangeForm &&(
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                        <div>
                            <label htmlFor="startDate" className={styles.searchLabel}>Start Day:</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={searchData.startDate}
                                onChange={handleSearchFormChange}
                                className={styles.searchInput} // Aplica el estilo del input
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className={styles.searchLabel}>End Date:</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={searchData.endDate}
                                onChange={handleSearchFormChange}
                                className={styles.searchInput} // Aplica el estilo del input
                            />
                        </div>
                        <button type="submit" className={styles.searchButton}>Search</button>
                    </form>
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
                {!showPasswordChangeForm && (
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
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
                                {dataRows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.task}</td>
                                        <td>{row.type}</td>
                                        <td>{row.alias}</td>
                                        <td>{row.comments}</td>
                                        <td>{row.status}</td>
                                        <td>{row.start_time}</td> 
                                        <td>{row.end_time}</td> 
                                        <td>{row.total_time}</td> 
                                        <td>{row.roll}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
