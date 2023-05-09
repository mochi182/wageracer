
window.onload = function () {
    const queryString = window.location.search;
    if (queryString) {
        const params = new URLSearchParams(queryString);
        const entity = params.get("entity");
        if (entity) {
            const select = document.getElementById("entity-select");
            const options = select.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === entity) {
                    select.value = entity;
                    selectChange();
                    return;
                }
            }
            console.log("No match found");
        }
    }
    selectChange();
};

// Checkbox that toggles fields for editing
const makeEditableCheckbox = document.querySelector("#makeEditable");
makeEditableCheckbox.addEventListener("change", (event) => {
    const formElements = document.querySelectorAll(".editInput");
    if (event.target.checked) {
        formElements.forEach((element) => {
            element.classList.add("editable");
            element.removeAttribute("disabled");
        });
    } else {
        formElements.forEach((element) => {
            element.classList.remove("editable");
            element.setAttribute("disabled", "true");
        });
    }
});

const entitySelect = document.querySelector('#entity-select');
entitySelect.addEventListener('change', selectChange);

async function selectChange() {
    const entity = entitySelect.value;

    // Fetch data rows
    const dataResponse = await fetch(`/admin?entity=${entity}`, {
        headers: { "Content-Type": "application/json" }
    });
    const rows = await dataResponse.json();

    // Fetch columns metadata
    const columnsResponse = await fetch(`/admin/get_columns?entity=${entity}`, {
        headers: { "Content-Type": "application/json" }
    });
    const columns = await columnsResponse.json();

    createTable(columns, rows);

    let createButton = document.querySelector("#create-entity-button");
    createButton.classList.remove("d-none");
    createButton.classList.add("d-block");

    document.querySelector("#buttonEntitySpan").innerHTML = entity;
}

function createTable(columns, rows) {
    const table = document.querySelector("#data");

    // Clear existing content
    table.innerHTML = "";

    let thead = createTHead(columns);
    table.appendChild(thead);

    let tbody = createTBody(columns, rows);
    table.appendChild(tbody);

    let tfoot = createTFoot(columns);
    table.appendChild(tfoot);
}

function createTHead(columns) {
    // Create thead
    const thead = document.createElement("thead");
    thead.classList.add("thead-dark");
    const tr = document.createElement("tr");
    columns.forEach((col) => {
        const th = document.createElement("th");
        th.textContent = col.COLUMN_NAME;
        tr.appendChild(th);
    });

    // Extra th for delete column
    tr.appendChild(document.createElement("th"));

    // Append row
    thead.appendChild(tr);
    return thead;
}

function createTBody(columns, rows) {
    const entity = document.getElementById("entity-select").value;

    // Create tbody
    const tbody = document.createElement("tbody");
    if (rows.length > 0) {
        rows.forEach((row) => {
            const tr = document.createElement("tr");

            columns.forEach((col) => {
                const td = document.createElement("td");
                const isPk = col.CONSTRAINT_NAME === "PRIMARY";
                const isFk = col.CONSTRAINT_NAME !== null && col.CONSTRAINT_NAME !== "PRIMARY";
                if (isPk) {
                    td.textContent = row[col.COLUMN_NAME];
                } else if (isFk) {
                    const select = document.createElement("select");
                    select.classList.add("form-select", "editInput");
                    select.name = col.COLUMN_NAME;

                    // Add default / null option
                    const option = document.createElement("option");
                    option.disabled = true;
                    option.selected = true;
                    option.value = "";
                    select.appendChild(option);

                    // Fetch the options for this select
                    fetch(`/admin?entity=${col.REFERENCED_TABLE_NAME}`)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data) {
                                data.forEach((optionData) => {
                                    const option = document.createElement("option");
                                    option.value = optionData.id;
                                    option.textContent = optionData.name;
                                    if (optionData.id == row[col.COLUMN_NAME]) {
                                        option.selected = true;
                                    }
                                    select.appendChild(option);
                                });
                            }
                        });

                    // If #makeEditable checkbox is not checked, disable the select
                    if (!(document.querySelector("#makeEditable").checked)) {
                        select.disabled = true;
                    }

                    // Event that triggers the edit
                    select.addEventListener('change', (e) => {
                        sendEditChange(e, row["id"], entity);
                    });
                    td.appendChild(select);
                } else {
                    var input;
                    if (col.DATA_TYPE.startsWith("varchar")) {
                        if (col.CHARACTER_MAXIMUM_LENGTH && parseInt(col.CHARACTER_MAXIMUM_LENGTH) > 30) {
                            input = document.createElement("textarea");
                            input.classList.add("form-control", "editInput");
                        } else {
                            input = document.createElement("input");
                            input.type = "text";
                        }
                        input.classList.add("form-control", "editInput");
                    } else if (col.DATA_TYPE.startsWith("int") || col.DATA_TYPE.startsWith("decimal")) {
                        input = document.createElement("input");
                        input.classList.add("form-control", "editInput");
                        input.type = "number";
                    } else if (col.DATA_TYPE === "date" || col.DATA_TYPE === "datetime") {
                        input = document.createElement("input");
                        input.classList.add("form-control", "editInput");
                        input.type = col.DATA_TYPE;
                    } else if (col.DATA_TYPE === "tinyint") {
                        input = document.createElement("input");
                        input.classList.add("form-check-input", "editInput");
                        input.type = "checkbox";
                        input.addEventListener('change', (e) => { e.target.value = e.target.checked ? 1 : 0 });
                    }

                    input.value = row[col.COLUMN_NAME];
                    input.placeholder = col.COLUMN_NAME;
                    input.name = col.COLUMN_NAME;
                    if (col.IS_NULLABLE !== "YES") {
                        input.required = true;
                    }

                    // If #makeEditable checkbox is not checked, disable the input
                    if (!(document.querySelector("#makeEditable").checked)) {
                        input.disabled = true;
                    }

                    // Event that triggers the edit
                    input.addEventListener('change', (e) => {
                        sendEditChange(e, row["id"], entity);
                    });

                    td.appendChild(input);
                }

                tr.appendChild(td);
            });

            const deleteBtn = createDeleteBtn(row["id"], entity);
            const tdDelete = document.createElement("td");
            tdDelete.appendChild(deleteBtn);
            tr.appendChild(tdDelete);
            tbody.appendChild(tr);
        });


    } else {
        // Create a single empty row if there are no rows
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = columns.length + 1;
        td.textContent = "No data available";
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    return tbody;
}

function createTFoot(columns) {
    // Create tfoot
    const tfoot = document.createElement("tfoot");
    tfoot.classList.add("tfoot-success");
    const trFooter = document.createElement("tr");
    columns.forEach((col) => {
        const td = document.createElement("td");
        const isPk = col.CONSTRAINT_NAME === "PRIMARY";
        const isFk = col.CONSTRAINT_NAME !== null && col.CONSTRAINT_NAME !== "PRIMARY";
        if (isPk) {
            td.innerHTML = "🔑";
        } else if (isFk) {
            const select = document.createElement("select");
            select.classList.add("form-select", "createInput");
            select.name = col.COLUMN_NAME;

            // Add default option
            const option = document.createElement("option");
            option.disabled = true;
            option.selected = true;
            option.textContent = `Select ${col.REFERENCED_TABLE_NAME}`;
            option.value = "";
            select.appendChild(option);

            // Fetch the options for this select
            fetch(`/admin?entity=${col.REFERENCED_TABLE_NAME}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data) {
                        data.forEach((optionData) => {
                            const option = document.createElement("option");
                            option.value = optionData.id;
                            option.textContent = optionData.name;
                            select.appendChild(option);
                        });
                    }
                });
            td.appendChild(select);
        } else {
            var input;
            if (col.DATA_TYPE.startsWith("varchar")) {
                if (col.CHARACTER_MAXIMUM_LENGTH && parseInt(col.CHARACTER_MAXIMUM_LENGTH) > 30) {
                    input = document.createElement("textarea");
                    input.classList.add("form-control", "createInput");
                } else {
                    input = document.createElement("input");
                    input.type = "text";
                }
                input.classList.add("form-control", "createInput");
            } else if (col.DATA_TYPE.startsWith("int") || col.DATA_TYPE.startsWith("decimal")) {
                input = document.createElement("input");
                input.classList.add("form-control", "createInput");
                input.type = "number";
            } else if (col.DATA_TYPE === "date" || col.DATA_TYPE === "datetime") {
                input = document.createElement("input");
                input.classList.add("form-control", "createInput");
                input.type = col.DATA_TYPE;
            } else if (col.DATA_TYPE === "tinyint") {
                input = document.createElement("input");
                input.classList.add("form-check-input", "createInput");
                input.type = "checkbox";
                input.value = 0;
                input.addEventListener('change', (e) => { e.target.value = e.target.checked ? 1 : 0 });
            }

            input.placeholder = col.COLUMN_NAME;
            input.name = col.COLUMN_NAME;
            if (col.IS_NULLABLE !== "YES") {
                input.required = true;
            }
            td.appendChild(input);
        }
        trFooter.appendChild(td);
    });
    // Extra td for delete column
    trFooter.appendChild(document.createElement("td"));

    // Append row
    tfoot.appendChild(trFooter);
    return tfoot;
}

function sendEditChange(e, id, entity) {
    const formData = { [e.target.name]: e.target.value };
    const url = `/admin/${id}?entity=${entity}`;

    fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    }).then(response => {
        if (response.ok) {
            //window.location.href = window.location.pathname + `?entity=${entity}`;
        } else {
            console.log(`Error: ${response.status} - ${response.statusText}`);
        }
    }).catch(error => {
        console.log(error);
    });
}

function createDeleteBtn(id, entity) {
    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("badge", "btn", "btn-danger");
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this row?");
        if (confirmDelete) {
            try {
                const deleteResponse = await fetch(`/admin/${id}?entity=${entity}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
                if (deleteResponse.ok) {
                    console.log(data);
                    window.location.href = window.location.pathname + `?entity=${entity}`
                } else {
                    console.log(`Error: ${deleteResponse.status}`);
                }
            } catch (err) {
                console.log(err);
            }
        }
    });
    return deleteBtn;
}

const createEntityButton = document.getElementById("create-entity-button");
createEntityButton.addEventListener("click", sendData);

function sendData() {
    const entitySelect = document.getElementById("entity-select");
    const entity = entitySelect.value;
    const createInputs = document.querySelectorAll(".createInput");
    const formData = new FormData();

    createInputs.forEach((input) => {
        const name = input.getAttribute("name");
        const value = input.value;
        if (value) {
            formData.append(name, value);
        }
    });

    fetch(`/admin?entity=${entity}`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("Something went wrong.");
            }
        })
        .then((data) => {
            console.log(data);
            window.location.href = window.location.pathname + `?entity=${entity}`
        })
        .catch((error) => {
            console.error(error);
        });
}
