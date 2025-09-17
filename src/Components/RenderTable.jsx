import React, { useState, useEffect } from "react";

const calculateVariance = (originalValue, newValue) => {
  console.log("original valye >>>>", originalValue, newValue);
  if (originalValue === 0) return 0;
  let updatedVariance = ((newValue - originalValue) / originalValue) * 100;
  console.log("updated variance >>>", updatedVariance?.toFixed(2));
  return updatedVariance?.toFixed(2);
};

const updateParentValue = (rows, updatedRow) => {
  return rows.map((row) => {
    console.log("row from iteration >>>", row, updatedRow);
      if (row.id === updatedRow.id) {
        console.log("inside this row od >>>",row?.id)
      const newValue =
        updatedRow.value +
        (row.children?.reduce((acc, child) => acc + child.value, 0) || 0);
      row.value = newValue;
    }
      if (row.children) {

      row.children = updateParentValue(row.children, updatedRow);
    }
    return row;
  });
};

// TableRow Component
const TableRow = ({
  row,
  originalValue,
  handleAllocationPercent,
  handleAllocationValue,
  parentValue,
  isChild,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [variance, setVariance] = useState(0);
  //     console.log("______________________________________________________")
  // console.log("row value >>>",row)
  // console.log("isChild >>>", isChild);
  function handlePercentChange() {
    // console.log("from handle percentage >>>", row.value, inputValue);
    // console.log("originalValue  >>>", originalValue);
console.log("selected row >>>>",row, inputValue)
    let newValue = row.value + (row.value * inputValue) / 100;
    handleAllocationPercent(row.id, newValue, row.value);
    setVariance(calculateVariance(originalValue, newValue));
  }

  function handleValueChange() {
    const newValue = parseFloat(inputValue);
    handleAllocationValue(row.id, newValue);
    setVariance(calculateVariance(originalValue, newValue));
  }

  useEffect(() => {
    setVariance(calculateVariance(originalValue, row.value));
  }, []);

  return (
    <tr style={{ border: "1px solid red" }}>
      <td style={{ paddingLeft: isChild ? "20px" : "0" }}> {row.label}</td>
      <td>{row.value}</td>
      <td>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
      </td>
      <td>
        <button onClick={handlePercentChange}>Allocation %</button>
      </td>
      <td>
        <button onClick={handleValueChange}>Allocation Val</button>
      </td>
      <td>{variance}%</td>
    </tr>
  );
};

// Table Component
const Table = ({ rows }) => {
  const [tableData, setTableData] = useState(rows);

  // Handle percentage update
  function handleAllocationPercent(id, newValue, existingValue) {
      const updatedRows = tableData.map((row) => {
        console.log("update parent value >>>>",row, newValue , id,existingValue)
      if (row.id === id) {
        row.value = newValue;
      }
          if (row.children) {
          row.children = updateParentValue(row.children, row);
          
      }
      return row;
    });
    setTableData(updatedRows);
  }

  // Handle Value Update
  function handleAllocationValue(id, newValue) {
    const updatedRows = tableData.map((row) => {
      if (row.id === id) {
        row.value = newValue;
      }
      if (row.children) {
        console.log("row children >>> and new value >>", row, newValue, id);
        row.children.forEach((val) => {
          if (val?.id == id) {
            val.value = newValue;
            row.value = row.value + newValue;
          }
        });
        // row.children = updateParentValue(row.children, row);

        // row.children =
      }
      return row;
    });
    setTableData(updatedRows);
  }

  // Calculate the grand total
  const grandTotal = tableData.reduce(
    (acc, row) =>
      acc +
      row.value +
      (row.children?.reduce((childAcc, child) => childAcc + child.value, 0) ||
        0),
    0
  );

  return (
    <div style={{ padding: 10 }}>
      <table style={{ width: "100%" }}>
        <thead style={{ borderBottomColor: "green" }}>
          <tr style={{ backgroundColor: "red", color: "white" }}>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "whitesmoke", textAlign: "center" }}>
          {tableData.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow
                row={row}
                originalValue={row.value}
                handleAllocationPercent={handleAllocationPercent}
                handleAllocationValue={handleAllocationValue}
                isChild={false}
              />
              {row?.children?.length > 0 &&
                row.children.map((child) => (
                  <TableRow
                    key={child.id}
                    row={child}
                    originalValue={child.value}
                    handleAllocationPercent={handleAllocationPercent}
                    handleAllocationValue={handleAllocationValue}
                    parentValue={row.value}
                    isChild={true}
                  />
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <h3>Grand Total : {grandTotal?.toFixed(2)} </h3>
    </div>
  );
};

// Main RenderTable Component
const RenderTable = () => {
  const data = [
    {
      id: "electronics",
      label: "Electronics",
      value: 1500,
      children: [
        { id: "phones", label: "Phones", value: 800 },
        { id: "laptops", label: "Laptops", value: 700 },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      children: [
        { id: "tables", label: "Tables", value: 300 },
        { id: "chairs", label: "Chairs", value: 700 },
      ],
    },
  ];

  return (
    <div>
      <h1>Simple Hierarchical Table Website</h1>
      <Table rows={data} />
    </div>
  );
};

export default RenderTable;
