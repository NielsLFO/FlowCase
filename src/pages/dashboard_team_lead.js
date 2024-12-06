import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCog } from 'react-icons/fa'; 
import styles from '../styles/dashboard_TL.module.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useRouter } from 'next/router';

import Select from "react-select"; // npm install react-select
import DatePicker from "react-datepicker"; // npm install react-datepicker
import "react-datepicker/dist/react-datepicker.css";

// Register components for the chart
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);
export default function Dashboard() {

    //#region Session  
        const router = useRouter();
        /*
        const INACTIVITY_LIMIT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        
        const handleUserActivity = () => {
            // Update the time of the last activity
            sessionStorage.setItem('lastActivity', Date.now());
        };
        
        const checkInactivity = () => {
            const lastActivity = sessionStorage.getItem('lastActivity');
            if (lastActivity) {
                const currentTime = Date.now();
                const timeSinceLastActivity = currentTime - parseInt(lastActivity, 10);
        
                // If more than 4 hours have passed, redirect to the home page
                if (timeSinceLastActivity > INACTIVITY_LIMIT) {
                    performSignOut();
                }
            }
        };
        
        useEffect(() => {
            // Check if the user is authenticated
            const userEmail = sessionStorage.getItem('userEmail');
            const role = sessionStorage.getItem('roleId');
            if (!userEmail || role !== "10") {
                alert(role);
                router.push('/');
            }
        
            // Set up events to track user activity
            window.addEventListener('mousemove', handleUserActivity);
            window.addEventListener('keydown', handleUserActivity);
        
            // Start the interval to check for inactivity
            const interval = setInterval(checkInactivity, 60 * 1000); // Check every minute
        
            // Clean up events and interval when the component unmounts
            return () => {
                window.removeEventListener('mousemove', handleUserActivity);
                window.removeEventListener('keydown', handleUserActivity);
                clearInterval(interval);
            };
        }, [router]);
    */
    //#endregion

    //#region States 
    /*********************************************************************************************/
    /***                                    state variables                                    ***/
    /*********************************************************************************************/
    const [selectedOption, setSelectedOption] = useState('Today Team Work');
    const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
    const [dataRows, setDataRows] = useState();
    const [dataRows_Report, setDataRows_Report] = useState();
    const [TL_Technitians, setTL_Technitians] = useState([]);
    const [taskOptionsByRole, setTaskOptionsByRole] = useState([]);
    const [AvailableTypeOptions, setAvailableTypeOptions] = useState([]);
    const [passwordChangeData, setPasswordChangeData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [filters, setFilters] = useState({
        technician: '',
        task: '',
        type: '',
        alias: '',
        status: ''
    });
    // State for the Snackbar and the alert
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

        const handleOptionChange = (option) => {
            setSelectedOption(option);
            setShowPasswordChangeForm(false);
            if(option == "Role Management"){
                loadRolesAndTechnicians();
            }else if (option == "Today Team Work"){
                fetchDailyReportsTl();
            }
        };
        const handleSettingsButtonClick  = async (e) => {
            
            setShowPasswordChangeForm(prev => !prev);
            
            // If the form is already shown, select "Today Work"
            if (showPasswordChangeForm) {
                setSelectedOption('Today Work');

            } else {
                setSelectedOption(''); // Clear option when opening the settings form
            }
        };

        const handleChangePassword = async (e) => {
            e.preventDefault();           
            try {
                const user_name = sessionStorage.getItem('user_name');
                const oldPassword = passwordChangeData.oldPassword;
                const newPassword = passwordChangeData.newPassword;
        
                const response = await fetch('/api/pass_change', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_name,
                        oldPassword,
                        newPassword
                    })
                });
        
                const result = await response.json();
        
                if (result.success) {
                    console.log('Password changed successfully');
                    showAlert('success', 'Password Change', 'Password changed successfully.');
                    setPasswordChangeData({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    });
                } else {
                    console.error('Error changing password:', result.message);
                    showAlert('error', 'Password Change', result.message || 'Error changing password.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                showAlert('error', 'Password Change', 'Failed to update password.');
            }
        };

        const handleChangePasswordCancel = async (e) => {          
            setPasswordChangeData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });       
        };
//#endregion

    //#region Grafic Code

    /*********************************************************************************************/
    /***                                    Grafic Code                                        ***/
    /*********************************************************************************************/

     // Color palette for the technicians (elegant and consistent)
        const techColors = [
            'rgba(75, 123, 139, 0.6)',  
            'rgba(153, 102, 255, 0.6)', 
            'rgba(255, 159, 64, 0.6)',  
            'rgba(54, 162, 235, 0.6)', 
            'rgba(255, 206, 86, 0.6)',  
            'rgba(105, 195, 140, 0.6)',
        ];

       // Data for the individual production chart
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

        // Options for the chart
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
            'rgba(66, 135, 245, 0.6)',  
            'rgba(255, 166, 0, 0.6)',   
            'rgba(231, 76, 60, 0.6)',  
        ];
    
        // State for the task chart data
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

       // Options for the chart
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


       // Color palette for the technicians (elegant and consistent)
       const techColors_Idle_Time = [
        'rgba(75, 123, 139, 0.6)',  
        'rgba(153, 102, 255, 0.6)', 
        'rgba(255, 159, 64, 0.6)', 
        'rgba(54, 162, 235, 0.6)',  
        'rgba(255, 206, 86, 0.6)',  
        'rgba(105, 195, 140, 0.6)', 
        ];

        // Data for the individual production chart
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

            // Options for the chart
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

    //#region Code for Manage Times section

    /*********************************************************************************************/
    /***                  All The Validations needed for Manage Times section                  ***/
    /*********************************************************************************************/

        const [searchData, setSearchData] = useState({
            startDate: '',
            endDate: '',
            user: '',
        });
        const [highlightedRow, setHighlightedRow] = useState(null);
        const [isEditing, setIsEditing] = useState(false);
        const [editingIndex, setEditingIndex] = useState(null);
        const [editData, setEditData] = useState({});
        
        const handleSearchFormChange = (e) => {
            const { name, value } = e.target;
            setSearchData(prev => ({ ...prev, [name]: value }));
        };

        const handleSearchSubmit = (e) => {
            e.preventDefault();

            if (searchData.startDate == "") { 
                showAlert('error', 'Error', 'Please select a start date.');
                return;
            }
            if (searchData.endDate == "") { 
                showAlert('error', 'Error', 'Please select an end date.');
                return;
            }
            
            fetchReports();
        };

        const handleModifyClick = (index) => {

            setIsEditing(true);
            setEditingIndex(index);
            setHighlightedRow(index);
            let previous_selectedRow = "";
            let selectedRow = "";
            let follow_selectedRow = "";

            if(index == 0){
                previous_selectedRow = null;
                selectedRow = dataRows_Report[index];
                follow_selectedRow = dataRows_Report[index + 1];
            }else if (index < (dataRows_Report.length - 1)){
                previous_selectedRow = dataRows_Report[index - 1];
                selectedRow = dataRows_Report[index];
                follow_selectedRow = dataRows_Report[index + 1];
            }else if (index == (dataRows_Report.length - 1)){
                previous_selectedRow = dataRows_Report[index - 1];
                selectedRow = dataRows_Report[index];
                follow_selectedRow = null;
            }
    
            // Separate date and time for start_time and end_time
            const [startDate, startTime] = selectedRow.start_time.split(' ');
            const [endDate, endTime] = selectedRow.end_time.split(' ');
            const role_id = dataRows_Report[index].role_id;
        
            // Update editData with the separated values
            setEditData({
                ...selectedRow,
                start_date: startDate,
                start_time: startTime, 
                end_date: endDate, 
                end_time: endTime,
                pre_row_id: previous_selectedRow ? previous_selectedRow.id : null,
                pre_row_end_time: previous_selectedRow ? previous_selectedRow.end_time : null,
                pre_row_start_time: previous_selectedRow ? previous_selectedRow.start_time : null,
                next_row_id: follow_selectedRow ? follow_selectedRow.id : null,
                next_row_star_time: follow_selectedRow ? follow_selectedRow.start_time : null,
                next_row_end_time: follow_selectedRow ? follow_selectedRow.end_time : null,
            });
        
            // Get the task ID
            const task = taskOptionsByRole.find(task => task.task_name === selectedRow.task_name);
            const task_id = task ? task.id : null;
        

            fetchTaskType(task_id,role_id);
        };
        

        const fetchTaskType = async (task_id,role_id) => {
            try {
                const res = await fetch('/api/TL/manage_times_types', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task_id: task_id, role_id: role_id }), 
                });
                const data = await res.json();        
                if (data.success) {
                    setAvailableTypeOptions(data.types);
                } else {
                    console.error('Error fetching types:', data.message);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        const fetchTask = async () => {
            if (sessionStorage.getItem('userEmail')) {
                try {
                    // Make a single request to get the role and associated tasks
                    const res = await fetch('/api/TL/manage_times_tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        setTaskOptionsByRole(data.tasks);   
                    } else {
                        console.error('Failed to fetch role and tasks:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching role and tasks:', error);
                }
            }
        };

        useEffect(() => {
            fetchTask(); 
        }, []);

        const handleEditFormChange = (e) => {
            const { name, value } = e.target;
            setEditData((prevState) => ({
                ...prevState,
                [name]: value || "",
            })); 
        };

        const handleEditSubmit = (e) => {
            e.preventDefault();
        
            // Validate that the alias has 5 characters if the task is "Production"
            if (editData.task_id == 1 && editData.alias.length !== 5) {
                showAlert('error', 'Error', 'Please, the alias must be 5 characters long.');
                return;
            }
        
            // Validate that the comment field is not empty if type is 'Other'

            if ((editData.type_id == 57 || editData.type_id == 58 || editData.type_id == 59) && !editData.commment) {
                showAlert('error', 'Error', 'Please fill in the comments when selecting "Other".');
                return;
            }
            
            // Concatenate date and time to create `Date` objects
            const startTime = new Date(`${editData.start_date} ${editData.start_time}`);
            const endTime = new Date(`${editData.end_date} ${editData.end_time}`);

            // Verify that `startTime` is earlier than `endTime`
            if (startTime >= endTime) {
                showAlert('error', 'Error', 'The start time must be earlier than the end time.');
                return;
            }

            // Calculate the elapsed time

            const timeDifference = endTime - startTime;
            const elapsedMinutes = Math.floor(timeDifference / 60000);

            // Format the dates in the `YYYY-MM-DD HH:MM:SS` format
            const formattedStartTime = formatDateTime(startTime);
            const formattedEndTime = formatDateTime(endTime);

            const updatedData = {
                task_id: editData.task_id,
                type_id: editData.type_id,
                alias: editData.alias,
                commment: editData.commment,
                row_status: editData.row_status,
                start_time: formattedStartTime, 
                end_time: formattedEndTime,     
                totalTime: elapsedMinutes,
                role_id: editData.role_id,
                pre_row_id: editData.pre_row_id,
                pre_row_time: editData.pre_row_time,
                next_row_id: editData.next_row_id,
                pre_row_end_time: editData.pre_row_end_time,
                pre_row_start_time:  editData.pre_row_start_time,
                next_row_star_time: editData.next_row_star_time,
                next_row_end_time: editData.next_row_end_time,
            };

            update_data(editData.id,updatedData);
        
            // Reset the edit state
            setIsEditing(false);
            setEditingIndex(null);
            setEditData({});
            setHighlightedRow(null);
            
        };
        
        const handleCancelClick = () => {
            setIsEditing(false); // Hide the form when clicking "Cancel"
            setHighlightedRow(null);
        };

        const formatDateTime = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month in two digits
            const day = String(date.getDate()).padStart(2, '0'); // Day in two digits
            const hours = String(date.getHours()).padStart(2, '0'); // Hours in two digits
            const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes in two digits
            const seconds = String(date.getSeconds()).padStart(2, '0'); // Seconds in two digits 
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        

        const getStatusOptions = () => {
            return ['Finish', 'Stop'] || [];
        };

        const fetchTechList = async () => {
        
            const tl = sessionStorage.getItem('user_name');
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
        
        const fetchReports = async () => {
            const user_id = searchData.user;
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
                setSearchData(prevData => ({ ...prevData, user: TL_Technitians[0].id }));
            }
        }, [searchData.startDate, searchData.endDate]);

        const update_data = async (id, updatedData) => {

            try {
                const res = await fetch('/api/TL/manage_times_update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ row_id: id, data: updatedData }), 
                });
                const data = await res.json();        
                if (data.success) {
                    showAlert('success', 'Update', 'The register was updated successfully.');
                    fetchReports();
                } else {
                    console.error('Error fetching types:', data.message);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

    //#endregion

    //#region Code for role managing

        /*********************************************************************************************/
        /***                    All The Validations needed for managing roles                      ***/
        /*********************************************************************************************/

            const [technicians, setTechnicians] = useState([]);
            const [roles, setRoles] = useState([]);

            const fetchAvailableRoles = async () => {
                try {
                    const response = await fetch('/api/TL/getAvailableRoles', { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ }),
                    });                                 
                    const result = await response.json();            
                    if (result.success) {
                        setTechnicians(result.roleRows); 
                    } else {
                        alert(result.message || "Error al actualizar cargar los roles.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error en la conexión.");
                }
            };

            const fetchTechniciansWithRoles = async () => {
                const tl_name = sessionStorage.getItem('user_name');
                try {
                    const response = await fetch('/api/TL/getTechniciansWithRoles', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ tl_name }),
                    });
                    const result = await response.json();
                    if (result.success) {
                        const techniciansWithRoles = result.data.map(tech => {
                            const roleAssignments = {};
                            // For each available role, we assign whether the technician has that role
                            technicians.forEach(role => {
                                roleAssignments[role.role_name] = tech.role_id === role.id;
                            });
                            return { name: tech.user_name, ...roleAssignments };
                        });
                        setRoles(techniciansWithRoles);
                    } else {
                        alert(result.message || "Error al obtener técnicos y roles.");
                    }
                } catch (error) {
                    console.error("Error al obtener técnicos y roles:", error);
                }
            };
            
            const handleCheckboxChange = (technicianIndex, role) => {
                const updatedRoles = [...roles];
                // Deselect all roles for this technician
                Object.keys(updatedRoles[technicianIndex]).forEach(r => {
                    if (r !== 'name') updatedRoles[technicianIndex][r] = false;
                });
                // Select only the current role
                updatedRoles[technicianIndex][role] = true;
                setRoles(updatedRoles);
            };
            
            // Handle the checkbox change in the header
            const handleHeaderCheckboxChange = (role) => {
                const updatedRoles = roles.map(tecnico => {
                    const newRoles = { ...tecnico };
                    // Deselect all roles for this technician
                    Object.keys(newRoles).forEach(r => {
                        if (r !== 'name') newRoles[r] = false;
                    });
                    newRoles[role] = true;
                    return newRoles;
                });
                setRoles(updatedRoles);
            };

            const roleMap = {};
            technicians.forEach(role => {
                roleMap[role.role_name] = role.id;
            });

            // Function to prepare the data for the database
            const prepareRolesDataForDB = () => {
                const dataToSave = roles.map(tecnico => {
                    const assignedRoleId = Object.keys(tecnico)
                        .filter(roleName => roleName !== 'name' && tecnico[roleName]) // Filter active roles
                        .map(roleName => roleMap[roleName])[0]; // Only take the first role found       
                    return {
                        name: tecnico.name,
                        assignedRoleId: assignedRoleId // This should be a single role ID
                    };
                });
            
                console.log("Datos a enviar:", dataToSave); // Verify data before sending it
                return dataToSave;
            };
            
            const saveChanges = async () => {

                const dataToSave = prepareRolesDataForDB(); // Now it gets only one assignedRoleId per technician

                try {
                    const response = await fetch('/api/TL/update_roles', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ roles: dataToSave }) // Ensure that 'roles' is an array
                    });
                    const data = await response.json();
                    if (data.success) {
                        showAlert('success', 'Role Change', 'The role was updated successfully.');
                    } else {
                        console.error("Error updating roles:", data.message);
                        showAlert('error', 'Role Change', 'Failed to update roles.');
                    }
                } catch (error) {
                    console.error("Error sending the request:", error);
                    showAlert('error', 'Role Change', 'Failed to update roles.');
                }
            };

            const loadRolesAndTechnicians = async () => {
                await fetchAvailableRoles();
            };

            useEffect(() => {
                if (technicians.length > 0) {
                    fetchTechniciansWithRoles();
                }
            }, [technicians]);

    //#endregion

    //#region Code for report

        /*********************************************************************************************/
        /***                             Report and data for grafics                               ***/
        /*********************************************************************************************/

        const fetchDailyReportsTl = async () => {
            const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' '); // Formato YYYY-MM-DD
            const tl_name = sessionStorage.getItem('user_name');
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

                    // Get unique names and count cases for each technician
                    const uniqueUsers = Array.from(new Set(data.map(item => item.user_name)));
                    const caseCounts = uniqueUsers.map(user => 
                        data.filter(item => item.user_name === user && item.type_value === "New case" && item.row_status == "Finish").length
                    );

                    // Create dynamic data for the chart
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

                    // Create dynamic data for the chart
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

                    // Update the chart state
                    setGroupData(dynamicGroupData);


                    // Sum the total "Idle_Time" for each user
                    const idleTimeCounts = uniqueUsers.map(user => {
                        // Filter records corresponding to "Idle_Time" and the current user
                        const idleTimeRecords = data.filter(
                            item => item.user_name === user && item.task_name === "Idle_Time"
                        );
                        // Sum the total time for this user in "Idle_Time"
                        const totalIdleTime = idleTimeRecords.reduce((sum, record) => {
                            // Convert total_time to an integer and sum it
                            return sum + parseInt(record.total_time, 10);
                        }, 0);
                        return totalIdleTime;
                    });

                    // Create dynamic data for the chart
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

                    // Update the chart state
                    setIndividualData_Idle_Time(dynamicIndividualData_Idle_Time);

                } else {
                    showAlert('error', 'Error', result.message || "Error updating the table.");
                }
            } catch (error) {
                console.error(error);
                showAlert('error', 'Error', "Connection error.");
            }
        };
    
        useEffect(() => {
            fetchDailyReportsTl(); 
        }, []);

        const handleFilterChange = (e) => {
            setFilters({
                ...filters,
                [e.target.name]: e.target.value
            });
        };
    
        // Filtrar los datos según los filtros establecidos
        const filteredData = Array.isArray(dataRows) ? dataRows.filter((row) => {
            return (
                (filters.technician === '' || row.user_name.toLowerCase().includes(filters.technician.toLowerCase())) &&
                (filters.task === '' || row.task_name.toLowerCase().includes(filters.task.toLowerCase())) &&
                (filters.type === '' || row.type_value.toLowerCase().includes(filters.type.toLowerCase())) &&
                (filters.alias === '' || row.alias.toLowerCase().includes(filters.alias.toLowerCase())) &&
                (filters.status === '' || row.row_status.toLowerCase().includes(filters.status.toLowerCase()))
            );
        }) : [];
        
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
        const handleSignOut = () => {
            performSignOut();
        };

        const performSignOut = () => {
            sessionStorage.clear();
            console.log('User signed out');
            router.push('/'); // Redirige al inicio
        };

    //#endregion
   
    const [activeTab, setActiveTab] = useState('add');
    const [activeOvertimeData, setActiveOvertimeData] = useState([]);


    const [overtimeData, setOvertimeData] = useState([]);
    const timeOptions = Array.from({ length: 24 }, (_, hour) =>
        Array.from({ length: 2 }, (_, half) => ({
        value: `${hour.toString().padStart(2, "0")}:${half === 0 ? "00" : "30"}`,
        label: `${hour.toString().padStart(2, "0")}:${half === 0 ? "00" : "30"}`,
        }))
    ).flat();

    useEffect(() => {
        const fetchTechnicians = async () => {
        const tl_name = sessionStorage.getItem("user_name");
        try {
            const response = await fetch("/api/TL/getTechnicians", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tl_name }),
            });
            const result = await response.json();
            if (result.success) {
            const techniciansWithRoles = result.data.map((tech) => ({
                id: tech.id,
                user: tech.user_name, 
                option: "", 
                date: null, 
                start: "", 
                end: "", 
                comments: "", 
            }));
            setOvertimeData(techniciansWithRoles);
            } else {
            alert(result.message || "Error al obtener técnicos y roles.");
            }
        } catch (error) {
            console.error("Error al obtener técnicos y roles:", error);
        }
    };

    fetchTechnicians();
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedData = [...overtimeData];
        updatedData[index][field] = value;
        setOvertimeData(updatedData);
    };

    const handleSubmit = () => {
        // Filtrar solo los usuarios con todos los campos necesarios (excepto comentarios, que son opcionales)
        const dataToSave = overtimeData.filter(
            (row) => row.option && row.date && row.start && row.end
        );
    
        if (dataToSave.length === 0) {
            alert("No hay datos válidos para guardar.");
            return;
        }
    
        // Mostrar en consola los datos para depuración (opcional)
        console.log("Overtime data to save:", dataToSave);
    
        // Llamar a la función para enviar los datos
        addOvertime(dataToSave);
    };
    
    const addOvertime = async (dataToSave) => {
        try {
            // Enviar la solicitud POST al servidor
            const response = await fetch('/api/TL/add_overtime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave), // Enviar los datos en el cuerpo de la solicitud
            });
    
            const result = await response.json();
    
            if (result.success) {
                // Manejar éxito: muestra mensaje, limpia datos o actualiza la UI
                alert("Datos guardados exitosamente.");
                // Aquí puedes limpiar el formulario o recargar datos
            } else {
                // Manejar errores desde el servidor
                showAlert('error', 'Error', result.message || "Error al guardar los datos.");
            }
        } catch (error) {
            // Manejar errores de conexión o de servidor
            console.error("Error al guardar los datos:", error);
            showAlert('error', 'Error', "Error de conexión al servidor.");
        }
    };

    useEffect(() => {
        fetchActiveOvertimeData();
    }, []);
    
    const fetchActiveOvertimeData = async () => {
        const tl_name = sessionStorage.getItem("user_name");
        try {
            const response = await fetch('/api/TL/change_overtime', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const result = await response.json({ tl_name });
    
            if (result.success) {
                setActiveOvertimeData(result.data); // Carga los datos activos en el estado
            } else {
                alert(result.message || 'Error al cargar las horas extras activas.');
            }
        } catch (error) {
            console.error('Error al cargar las horas extras activas:', error);
        }
    };

    const handleInputChange2 = (index, field, value) => {
        const updatedData = [...activeOvertimeData];
        updatedData[index][field] = value;
        setActiveOvertimeData(updatedData);
    };
    
    
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
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Overtime' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Overtime')}
                        >
                            Overtime
                        </button>
                        <button
                            className={`${styles.optionButton} ${selectedOption === 'Report' ? styles.activeOption : ''}`}
                            onClick={() => handleOptionChange('Report')}
                        >
                            Report 
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
                {/* Snackbar to display the alert message */}
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
                 {/* Filtros */}
                 {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                 <div className={styles.container}>
                    {/* Filtros */}
                    <div className={styles.filters}>
                        <input
                            type="text"
                            name="technician"
                            value={filters.technician}
                            onChange={handleFilterChange}
                            placeholder="Filter by Technician"
                        />
                        <input
                            type="text"
                            name="task"
                            value={filters.task}
                            onChange={handleFilterChange}
                            placeholder="Filter by Task"
                        />
                        <input
                            type="text"
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            placeholder="Filter by Type"
                        />
                        <input
                            type="text"
                            name="alias"
                            value={filters.alias}
                            onChange={handleFilterChange}
                            placeholder="Filter by Alias"
                        />
                        <input
                            type="text"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            placeholder="Filter by Status"
                        />
                    </div>
                </div>
                )}
                {selectedOption === 'Today Team Work' && !showPasswordChangeForm && (
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
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
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr
                                        key={index}
                                        style={{ backgroundColor: index === highlightedRow ? '#f0f8ff' : 'transparent' }}
                                    >
                                        <td>{row.id}</td>
                                        <td>{row.row_date.split('T')[0]}</td>
                                        <td>{row.user_name}</td>
                                        <td>{row.task_name}</td>
                                        <td>{row.type_value}</td>
                                        <td>{row.alias}</td>
                                        <td>{row.commment}</td>
                                        <td>{row.row_status}</td>
                                        <td>{row.start_time}</td>
                                        <td>{row.end_time}</td>
                                        <td>{Math.floor(row.total_time / 60) + ' h ' + (row.total_time % 60) + ' min'}</td>
                                        <td>{row.role_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                )}
                {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
                    <div className={styles.container_searchForm}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                            <div className={styles.searchForm}> 
                                <label htmlFor="startDate" className={styles.searchLabel}> 
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
                                <label htmlFor="endDate" className={styles.searchLabel}> 
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
                                <label htmlFor="technician" className={styles.searchLabel}> 
                                    Select Technician
                                </label>

                                <select id="technician" name="user" value={searchData.id} onChange={handleSearchFormChange} className={styles.searchInput}>
                                    {TL_Technitians.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.user_name}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className={styles.searchButton}>Search</button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Table with the specified fields */}
                {selectedOption === 'Manage Times' && !showPasswordChangeForm && (
                    <div className={styles.container}>
                        <div className={`${styles.tableContainer} ${isEditing ? styles.shrinkTable : ''}`}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>                         
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
                                            <td>{row.id}</td>
                                            <td>{row.row_date.split('T')[0]}</td>
                                            <td>{row.user_name}</td>                        
                                            <td>{row.task_name}</td>
                                            <td>{row.type_value}</td>
                                            <td>{row.alias}</td>
                                            <td>{row.commment}</td>
                                            <td>{row.row_status}</td>
                                            <td>{row.start_time}</td> 
                                            <td>{row.end_time}</td> 
                                            <td>{Math.floor(row.total_time / 60) + ' h ' + (row.total_time % 60) + ' min'}</td> 
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
                                        name="user_name"
                                        value={editData.user_name}
                                        onChange={handleEditFormChange}
                                        placeholder="Technician"
                                        disabled
                                        className={styles.searchInput} 
                                    />
                                    <select 
                                        name="task_id"
                                        value={editData.task_id}
                                        onChange={(e) => { 
                                            handleEditFormChange(e);
                                            fetchTaskType(e.target.value, editData.role_id);
                                        }}
                                        className={styles.editList} 
                                    >
                                        {taskOptionsByRole.map(task => (
                                            <option key={task.id} value={task.id}>
                                            {task.task_name}
                                        </option>
                                        ))}
                                    </select>
                                    <select 
                                        name="type_id"
                                        value={editData.type_id}
                                        onChange={handleEditFormChange}
                                        className={styles.editList} 
                                    >
                                        {AvailableTypeOptions.map(type => (
                                            <option key={type.id} value={String(type.id)}>
                                                {type.type_value}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Show alias only if task is "Production" */}
                                    {editData.task_name === 'Production' && (
                                        <input 
                                            type="text"
                                            name="alias"
                                            value={editData.alias}
                                            onChange={handleEditFormChange}
                                            placeholder="Alias"
                                            className={styles.searchInput} 
                                        />
                                    )}
                                    <input 
                                        type="text"
                                        name="commment"
                                        value={editData.commment}
                                        onChange={handleEditFormChange}
                                        placeholder="Comments"
                                        className={styles.searchInput} 
                                    />
                                    <select 
                                        name="row_status" 
                                        value={editData.row_status}
                                        onChange={handleEditFormChange}
                                        className={styles.editList} 
                                    >
                                        {getStatusOptions().map((typeObj, index) => (
                                            <option key={index} value={typeObj}>
                                                {typeObj}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        name="start_time"
                                        value={editData.start_time} 
                                        onChange={handleEditFormChange}
                                        placeholder="Start Time"
                                        required
                                        className="searchInput" 
                                        maxLength={8} 
                                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])" 
                                    />

                                    <input
                                        type="text"
                                        name="end_time"
                                        value={editData.end_time} 
                                        onChange={handleEditFormChange}
                                        placeholder="End Time"
                                        required
                                        className="searchInput" 
                                        maxLength={8} 
                                        pattern="([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])" 
                                    />
                                    <button type="submit" className={styles.editButton}>Save Changes</button> 
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
                                <th>Technician</th>
                                {technicians.map((role) => (
                                    <th key={role.role_name}>
                                        <div style={{ textAlign: 'center' }}>
                                            {role.role_name}<br />
                                            <input 
                                                type="checkbox" 
                                                checked={roles.every((tecnico) => tecnico[role.role_name])} 
                                                onChange={() => handleHeaderCheckboxChange(role.role_name)} 
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
                                    {technicians.map((role) => (
                                        <td key={role.role_name}>
                                            <input 
                                                type="checkbox" 
                                                checked={tecnico[role.role_name] || false} // Mark the checkbox according to the state
                                                onChange={() => handleCheckboxChange(index, role.role_name)} 
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
                        <form onSubmit={handleChangePassword}>
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
                            <button className={styles.cancelButton} type="button" onClick={() => handleChangePasswordCancel()}>Cancel</button>
                        </form>
                    </div>
                )}
                {selectedOption === 'Overtime' && !showPasswordChangeForm && (
                    <div className="tabs-container">
                        {/* Pestañas */}
                        <div className={styles.tableSection}>
                            <button
                                className={activeTab === 'add' ? `${styles.tab} ${styles.active}` : styles.tab}
                                onClick={() => setActiveTab('add')}
                            >
                                Add Overtime
                            </button>
                            <button
                                className={activeTab === 'modify' ? `${styles.tab} ${styles.active}` : styles.tab}
                                onClick={() => setActiveTab('modify')}
                            >
                                Modify Overtime
                            </button>
                            <button
                                className={activeTab === 'review' ? `${styles.tab} ${styles.active}` : styles.tab}
                                onClick={() => setActiveTab('review')}
                            >
                                Review Overtime
                            </button>
                            </div>

                        {/* Contenido de las pestañas */}
                        <div className="tab-content">
                            {activeTab === 'add' && (
                            <div>
                                <h2>Add Overtime</h2>
                                <div className={styles.tableContainer}>
                                    <table className={styles.overtimeTable}>
                                    <thead>
                                        <tr>
                                        <th>User</th>
                                        <th>Option</th>
                                        <th>Date</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overtimeData.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.user}</td>
                                            <td>
                                            <Select
                                                options={[
                                                { value: "all-day", label: "All day" },
                                                { value: "hours", label: "Hours" },
                                                { value: "reposition", label: "Reposition" },
                                                ]}
                                                onChange={(selected) =>
                                                handleInputChange(index, "option", selected.value)
                                                }
                                                placeholder="Select"
                                                className={styles.selectDropdown}
                                            />
                                            </td>
                                            <td>
                                            <DatePicker
                                                selected={row.date}
                                                onChange={(date) =>
                                                handleInputChange(index, "date", date)
                                                }
                                                dateFormat="yyyy/MM/dd"
                                                placeholderText="Select date"
                                                className={styles.datePicker}
                                            />
                                            </td>
                                            <td>
                                            <Select
                                                options={timeOptions}
                                                onChange={(selected) =>
                                                handleInputChange(index, "start", selected.value)
                                                }
                                                placeholder="Start time"
                                                className={styles.selectDropdown}
                                            />
                                            </td>
                                            <td>
                                            <Select
                                                options={timeOptions}
                                                onChange={(selected) =>
                                                handleInputChange(index, "end", selected.value)
                                                }
                                                placeholder="End time"
                                                className={styles.selectDropdown}
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="text"
                                                value={row.comments}
                                                onChange={(e) =>
                                                handleInputChange(index, "comments", e.target.value)
                                                }
                                                placeholder="Add comments"
                                                className={styles.inputField}
                                            />
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                                <button onClick={handleSubmit} className={styles.saveButton}>
                                    Submit
                                </button>
                            </div>
                            )}
                            {activeTab === 'modify' && (
                            <div>
                                <h2>Modify Overtime</h2>
                                    <div className={styles.tableContainer}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Option</th>
                                                <th>Date</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
                                                <th>Comments</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeOvertimeData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.user_id}</td>
                                                    <td>
                                                        <select
                                                            value={row.type_time || ''}
                                                            onChange={(e) => handleInputChange2(index, 'option', e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="all Day">All Day</option>
                                                            <option value="hours">Hours</option>
                                                            <option value="reposition">Reposition</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            selected={row.overtime_date ? new Date(row.overtime_date) : null}
                                                            onChange={(date) => handleInputChange2(index, 'date', date)}
                                                            dateFormat="yyyy-MM-dd"
                                                            className="datePickerInput"
                                                            placeholderText="Select a date"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="time"
                                                            value={row.start_time || ''}
                                                            onChange={(e) => handleInputChange2(index, 'start', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="time"
                                                            value={row.end_time || ''}
                                                            onChange={(e) => handleInputChange2(index, 'end', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={row.comments || ''}
                                                            onChange={(e) => handleInputChange2(index, 'comments', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={styles.saveButton}
                                                            onClick={() => handleSaveRow(row, index)}
                                                        >
                                                            Save
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            )}
                            {activeTab === 'review' && (
                            <div>
                                <h2>Review Overtime</h2>
                                <p>Formulario o contenido para revisar horas extra.</p>
                            </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
