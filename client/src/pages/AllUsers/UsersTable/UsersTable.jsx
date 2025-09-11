import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
// servicios
import { UserService } from "../../../services/user/user";
import { FlatService } from "../../../services/flat/flat";

export const UsersTable = ({userLoggedId}) => {

    // variables de estado
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [flats, setFlats] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    //filtros
    const [filters, setFilters] = useState({
        role: null,
        minAge: null,
        maxAge: null,
        minFlats: null,
        maxFlats: null,
    });

    // servicios
    const userService = new UserService();
    const flatService = new FlatService();

    const getUsers = async()=>{
        setLoading(true);
        const result = await userService.getAllUsers(filters);
        setUsers(result.data);
        setLoading(false);
        // console.log(result.data)
    }

    const getFlats = async()=>{
        const result = await flatService.getAllFlats();
        setFlats(result.data);
    }

    useEffect(()=>{
        getUsers();
    },[filters]);

    useEffect(()=> {
        getFlats();
    },[]);

    const userFilterTemplate = () => {
        return(
            <div className="flex flex-wrap gap-3">
                <div className="flex align-items-center">
                    <RadioButton inputId="adminid" name="role" value="admin" onChange={(e) => setFilters(prev => ({ ...prev, role: e.value }))} checked={filters.role === 'admin'} />
                    <label htmlFor="adminid" className="ml-2">Admin</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="userid" name="role" value="user" onChange={(e) => setFilters(prev => ({ ...prev, role: e.value }))} checked={filters.role === 'user'} />
                    <label htmlFor="userid" className="ml-2">User</label>
                </div>
            </div>
        );
    }

    const birthDateFilterTemplate = () => {
        return (
            <div className="w-full flex flex-row justify-center gap-1">
                <InputNumber
                    placeholder="Min Age"
                    className="w-[100px]"
                    value={filters.minAge}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minAge: e.value }))}
                />
                <InputNumber
                    placeholder="Max Age"
                    className="w-[100px]"
                    value={filters.maxAge}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxAge: e.value }))}
                />
            </div>
        );
    };

    const numberFlatsFilterTemplate = () => {
        return (
            <div className="w-full flex flex-row justify-center gap-1">
                <InputNumber
                    placeholder="Min Flats"
                    className="w-[100px]"
                    value={filters.minFlats}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minFlats: e.value }))}
                />
                <InputNumber
                    placeholder="Max Flats"
                    className="w-[100px]"
                    value={filters.maxFlats}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxFlats: e.value }))}
                />
            </div>
        );
    }

    const birthDateBodyTemplate = (rowData) => {
        if (!rowData.birthDate) return "Fecha no disponible";

        if (typeof rowData.birthDate === "object") {
            const birthDate = new Date(rowData.birthDate.seconds * 1000);
            const today = new Date();
    
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
    
            // Ajustar la edad si aún no ha pasado el cumpleaños este año
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }
    
            return <span>{age} años</span>;
        }
    
        return "Fecha no válida";
      };

    const userBodyTemplate = (rowData) => {
        return <span> {rowData.role} </span>
    }  

    const viewFlat = (id) => {
        navigate(`/profile/${id}`);
      };

    const viewBodyTemplate = (rowData)=> {
        return (
            <Button
            onClick={() => viewFlat(rowData.id)}
            type="button"
            icon="pi pi-eye"
            rounded
            className="bg-info_color"
            ></Button>
        );
    }

    const confirmAdminFlat = async (userRow) => {
        confirmDialog({
            message: "Are you sure you want to change this user's role?",
            header: "Role Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-success",
            accept: async () => {
                const newRole = userRow.role === "admin" ? "user" : "admin";
                const result = await userService.setUserAdmin(userRow.id, newRole);
    
                if (result.success) {

                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === userRow.id ? { ...user, role: newRole } : user
                        )
                    );
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: `User role changed to ${newRole}`,
                        life: 3000,
                    });
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to change user role",
                        life: 3000,
                    });
                }
            },
            reject: () => {
                toast.current.show({
                    severity: "warn",
                    summary: "Cancelled",
                    detail: "Role change cancelled",
                    life: 3000,
                });
            },
        });
    };

    const tasksBodyTemplate = (rowData) => {
        return (
            <Button
              onClick={() => confirmAdminFlat(rowData)}
              type="button"
              icon="pi pi-user-plus"
              rounded
              className=""
            ></Button>
          );
    }

    const confirmDeleteUser = (userId) => {
        if (userId === userLoggedId) {
            toast.current.show({
                severity: "warn",
                summary: "Action not allowed",
                detail: "You cannot delete yourself",
                life: 3000,
            });
            return;
        }
    
        confirmDialog({
            message: "Are you sure you want to delete this User? This will also delete all their flats.",
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: async () => {
                const flatDeletion = await flatService.deleteUserFlats(userId);
                
                if (!flatDeletion.success) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to delete user's flats",
                        life: 3000,
                    });
                    return;
                }
    
                const userDeletion = await userService.deleteUser(userId);
    
                if (userDeletion.success) {
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    
                    toast.current.show({
                        severity: "success",
                        summary: "Deleted",
                        detail: "User and their flats deleted successfully",
                        life: 3000,
                    });
                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to delete user",
                        life: 3000,
                    });
                }
            },
            reject: () => {
                toast.current.show({
                    severity: "warn",
                    summary: "Cancelled",
                    detail: "User deletion cancelled",
                    life: 3000,
                });
            }
        });
    };

    const deleteBodyTemplate = (rowData) => {
        return (
            <Button
              onClick={() => confirmDeleteUser(rowData.id)}
              type="button"
              icon="pi pi-trash"
              rounded
              className="bg-danger_color"
            ></Button>
          );
    }

    return(
        <>  
            <Toast ref={toast} />
            <ConfirmDialog />
            <DataTable
                size="small"
                scrollable
                tableStyle={{ minWidth: "50rem" }}
                dataKey="id"
                value={users}
                stripedRows
                showGridlines
                loading={loading}
                paginator
                rows={10}
                filterDisplay="row"
                emptyMessage="No users found."
                >
                <Column
                    field="firstName"
                    header="First Name"
                    style={{ width: "15%" }}
                    sortable 
                ></Column>
                <Column
                    field="lastName"
                    header="Last Name"
                    style={{ width: "15%" }}
                    sortable 
                ></Column>
                <Column
                    field="email"
                    header="Email"
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    header="Birth Date"
                    body={birthDateBodyTemplate}
                    style={{ width: "15%" }}
                    filter
                    filterElement={birthDateFilterTemplate}
                    showFilterMenu={false}
                ></Column>
                <Column
                    header="Number of Flats"
                    field="numberOfFlats"
                    style={{ width: "15%" }}
                    sortable 
                    filter
                    filterElement={numberFlatsFilterTemplate}
                    showFilterMenu={false}
                ></Column>
                <Column
                    header="Type of User"
                    body={userBodyTemplate}
                    style={{ width: "15%" }}
                    filter
                    filterElement={userFilterTemplate}
                    showFilterMenu={false}
                ></Column>
                <Column
                    header="View"
                    body={viewBodyTemplate}
                    style={{ width: "15%" }}
                ></Column>
                <Column
                    header="Tasks"
                    style={{ width: "15%" }}
                    body={tasksBodyTemplate}
                ></Column>
                <Column
                    header="Delete"
                    style={{ width: "15%" }}
                    body={deleteBodyTemplate}
                ></Column>
            </DataTable>
        </>
    );
}