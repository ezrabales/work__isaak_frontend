import { useEffect, useState } from "react";
import "./PriceSettings.css";
import Table from "../Table/Table";
import CreateNewPartModal from "../Modal/CreateNewPartModal";
import { useGlobal } from "../GlobalState/GlobalState";
import { editRate, getRate } from "../../utils/auth";
import { createPart, deletePart, getParts } from "../../utils/parts";
const PriceSettings = () => {
  const token = localStorage.getItem("jwt");
  const { modalOpen, setModalOpen } = useGlobal();
  const { parts, setParts } = useGlobal();
  const [loadingParts, setLoadingParts] = useState(true);
  const [hourlyRate, setHourlyRate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // rate
    getRate({ token })
      .then((res) => setHourlyRate(res.rate))
      .catch((err) => console.error(err));

    // parts
    getParts({ token })
      .then((res) => setParts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingParts(false));
  }, []);

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
            value={hourlyRate || 0}
            onChange={(e) => {
              setHourlyRate(e.target.value);
              editRate({ token, rate: e.target.value });
            }}
          />
          /hr
        </p>
      </div>
      <div className="settings__table-container">
        <h3 className="settings__table-title">Parts</h3>
        {loadingParts ? (
          <div className="loading-data" />
        ) : parts.length <= 0 ? (
          <div className="no-data">No Parts</div>
        ) : (
          <>
            <div className="settings__search-container">
              <input
                className="settings__search-bar"
                type="text"
                placeholder="Search parts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Table
              head={["Name", "Cost"]}
              body={parts
                .filter((part) =>
                  part.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map(({ _id, name, cost }, index) => [
                  name,
                  <div key={index} className="settings__table-btn-container">
                    {cost}
                    <button
                      id={_id}
                      onClick={(e) => {
                        const id = e.target.id;
                        deletePart({ token, id }).then((res) => {
                          setParts((prev) =>
                            prev.filter((part) => part._id !== res.id),
                          );
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>,
                ])}
            />
          </>
        )}
      </div>
      <button
        className="settings__add-part-btn"
        onClick={() => {
          setModalOpen("createPart");
        }}
      >
        Add Part
      </button>
      <CreateNewPartModal token={token} setParts={setParts} />
    </div>
  );
};
export default PriceSettings;
