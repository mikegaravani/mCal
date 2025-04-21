import CalComponent from "./CalComponent";
import AddEventDialog from "./add-forms/AddEventDialog";
import AddTaskDialog from "./add-forms/AddTaskDialog";

function Calendar() {
  return (
    <>
      <div className="p-6">
        <CalComponent />
        <AddEventDialog />
        <AddTaskDialog />
      </div>
    </>
  );
}

export default Calendar;
