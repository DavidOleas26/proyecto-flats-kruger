import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
// servicios
import { FlatService } from "../../../../services/flat/flat";
import { UserService } from "../../../../services/user/user";

export const MyFlatsTable = ({ userLoggedId }) => {

    const toast = useRef(null);

    // variables de estado
  const navigate = useNavigate();
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(false);

  // servicios
  const flatService = new FlatService();
  const userService = new UserService();

  const getMyFlats = async () => {
    setLoading(true);
    const result = await flatService.getMyFlats(userLoggedId);
    setFlats(result.data);
    setLoading(false);
    console.log(result.data);
  };

  useEffect(() => {
    getMyFlats();
  }, []);

  const StreetNameBodyTemplate = (rowData) => {
    return <span> {`${rowData.streetName} - ${rowData.streetNumber}`} </span>;
  };

  const acBodyTemplate = (rowData) => {
    return rowData.ac ? <span> Yes </span> : <span> No </span>;
  };

  const yearBuitBodyTemplate = (rowData) => {
    if (!rowData.yearBuilt) return "Fecha no disponible";

    if (typeof rowData.yearBuilt === "object") {
      const date = new Date(rowData.yearBuilt.seconds * 1000);
      const newDate = new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
      }).format(date);
      return <span> {newDate} </span>;
    }
  };

  const dateAvailableBodyTemplate = (rowData) => {
    if (!rowData.dateAvailable) return "Fecha no disponible";

    if (typeof rowData.yearBuilt === "object") {
      const date = new Date(rowData.dateAvailable.seconds * 1000);
      const newDate = new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
      return <span> {newDate} </span>;
    }
  };

  const confirmDeleteFlat = (flatId) => {
    confirmDialog({
        message: "Are you sure you want to delete this flat?",
        header: "Delete Confirmation",
        icon: "pi pi-exclamation-triangle",
        acceptClassName: "p-button-danger",
        accept: async () => {
            const result = await flatService.deleteFlat(flatId);
            await userService.minusFlatUser(userLoggedId);
            if (result.data) {
                setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
                toast.current.show({ severity: "success", summary: "Deleted", detail: "Flat deleted successfully", life: 3000 });
            } else {
                toast.current.show({ severity: "error", summary: "Error", detail: "Failed to delete flat", life: 3000 });
            }
        },
        reject: () => {
            toast.current.show({ severity: "warn", summary: "Cancelled", detail: "Flat deletion cancelled", life: 3000 });
        }
    });
};

  const deleteBodyTemplate = (rowData) => {
    return (
      <Button
        onClick={() => confirmDeleteFlat(rowData.id)}
        type="button"
        icon="pi pi-trash"
        rounded
        className="bg-danger_color"
      ></Button>
    );
  };

  const viewFlat = (id) => {
    navigate(`/view-flat/${id}`);
  };

  const viewBodyTemplate = (rowData) => {
    return (
      <Button
        onClick={() => viewFlat(rowData.id)}
        type="button"
        icon="pi pi-eye"
        rounded
        className="bg-info_color"
      ></Button>
    );
  };

  const editFlat = (id) => {
    navigate(`/edit-flat/${id}`);
  };

  const editBodyTemplate = (rowData) => {
    return (
      <Button
        onClick={() => editFlat(rowData.id)}
        type="button"
        icon="pi pi-cog"
        rounded
        className="bg-warning_color"
      ></Button>
    );
  };

  const newFlat = () => {
    navigate('/new-flat')
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          label="New Flat"
          outlined
          onClick={newFlat}
        />
      </div>
    );
  };
  const header = renderHeader();

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="w-[98%]">
          <DataTable
            size="small"
            scrollable
            tableStyle={{ minWidth: "50rem" }}
            dataKey="id"
            value={flats}
            stripedRows
            showGridlines
            loading={loading}
            paginator
            rows={10}
            header={header}
            emptyMessage="No flats found."
          >
            <Column
              field="city"
              header="City"
              style={{ width: "15%" }}
              sortable
            ></Column>
            <Column
              header="Street Name & Number"
              style={{ width: "25%" }}
              body={StreetNameBodyTemplate}
            ></Column>
            <Column
              field="area"
              header="Area Size (m2)"
              style={{ width: "15%" }}
              sortable
            ></Column>
            <Column
              header="AC"
              body={acBodyTemplate}
              style={{ width: "10%" }}
            ></Column>
            <Column
              header="Year Built"
              body={yearBuitBodyTemplate}
              style={{ width: "15%" }}
            ></Column>
            <Column
              field="rentPrice"
              header="Rent Price ($)"
              style={{ width: "25%" }}
              sortable
            ></Column>
            <Column
              header="Date Available"
              body={dateAvailableBodyTemplate}
              style={{ width: "25%" }}
            ></Column>
            <Column
              header="Delete"
              body={deleteBodyTemplate}
              style={{ width: "25%" }}
            ></Column>
            <Column
              header="View"
              body={viewBodyTemplate}
              style={{ width: "25%" }}
            ></Column>
            <Column
              header="Edit"
              body={editBodyTemplate}
              style={{ width: "25%" }}
            ></Column>
          </DataTable>
        </div>
      </div>
    </>
  );
};
