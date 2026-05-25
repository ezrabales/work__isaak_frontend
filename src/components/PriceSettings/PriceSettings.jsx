import { useState } from "react";
import "./PriceSettings.css";
import Table from "../Table/Table";
import CreateNewPartModal from "../Modal/CreateNewPartModal";
import { useGlobal } from "../GlobalState/GlobalState";

const PriceSettings = () => {
  const { modalOpen, setModalOpen } = useGlobal();
  const [hourlyRate, setHourlyRate] = useState(75);
  const parts = [
    ["part1", "$10"],
    ["part2", "$10"],
    ["part3", "$10"],
    ["part4", "$10"],
    ["part5", "$10"],
  ];

  // temporary, move to invoice later
  const downloadPDF = async () => {
    const element = pdfRef.current;

    const canvas = await html2canvas(element);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("price-settings.pdf");
  };
  {
    /* <button onClick={downloadPDF}>Download PDF</button> */
  }
  // import jsPDF from "jspdf";
  // import html2canvas from "html2canvas";
  // const pdfRef = useRef();

  return (
    <div className="settings">
      <h2 className="settings__title">Price Settings</h2>
      <div className="settings__hour-rate">
        <p>My hourly rate: </p>
        <p>
          $
          <input
            className="settings__input"
            type="number"
            name="hours"
            value={hourlyRate}
            onChange={(e) => {
              setHourlyRate(e.target.value);
            }}
          />
          /hr
        </p>
      </div>
      <div className="settings__table-container">
        <h3 className="settings__table-title">Parts</h3>
        <Table
          head={["Name", "Cost"]}
          body={parts.map(([name, cost], index) => [
            name,
            <div className="settings__table-btn-container">
              {cost}
              <button
                id={index}
                onClick={(e) => {
                  const id = e.target.id;
                  console.log(`TODO: Delete part ${id}`);
                }}
              >
                Delete
              </button>
            </div>,
          ])}
        />
      </div>
      <button
        className="settings__add-part-btn"
        onClick={() => {
          setModalOpen("createPart");
        }}
      >
        Add Part
      </button>
      <CreateNewPartModal />
    </div>
  );
};
export default PriceSettings;
