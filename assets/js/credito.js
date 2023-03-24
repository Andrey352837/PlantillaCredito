UpdateForm();


var email ;
var nombre ;
var tasa;
var plazo;
var valor ;
var fecha ;
var neto;
var montoSolicitar ;

function llenarCampos(){
 email = document.getElementById("correo").value;
 nombre = document.getElementById("nombre").value;
 tasa = parseFloat(document.getElementById("tasa").value);
 plazo = parseFloat(document.getElementById("plazo").value);
 valor = parseFloat(document.getElementById("valor").value);
 fecha = document.getElementById("fecha").value;
 neto = parseFloat(document.getElementById("neto").value);
 montoSolicitar = parseFloat(document.getElementById("montoSolicitar").value);
}
function Validate() {

    llenarCampos();
    let isThereError = false;

    try {       

        let lista = [email, nombre, fecha, neto, tasa, plazo, valor, montoSolicitar];

        let resultados = document.getElementById("resultados");
        resultados.parentNode.removeChild(resultados);

        lista.forEach(element => {
            element.classList.remove("border-danger");
        });

        lista.forEach(element => {

            let value = element.value;

            if (value == "") {
                element.classList.add("border-danger");
                isThereError = true;
            }
            else if (element.classList.contains("numerico")) {
                if (isNaN(value)) {
                    element.classList.add("border-danger");
                    isThereError = true;
                }
            }
        });

        if (isThereError == false && (parseFloat(montoSolicitar.value) > parseFloat(valor.value) * 0.8)) {
            montoSolicitar.classList.add("border-danger");
            isThereError = true;
        }

    } catch (error) {
        console.log(error)
    }

    return isThereError;

}

function Calculate() {
    try {

        if (!Validate()) {

           

            let data = {
                email: email,
                nombre: nombre,
                tasa: tasa,
                plazo: plazo,
                valor: valor,
                fecha: fecha,
                neto: neto,
                montoSolicitar: montoSolicitar
            };

            const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

            window.localStorage.clear();

            window.localStorage.setItem('data', JSON.stringify(data));

            let numerator = (montoSolicitar * (tasa / 100)) * Math.pow((1 + (tasa / 100)), plazo);
            let denominator = Math.pow((1 + (tasa / 100)), plazo) - 1;

            let result = Math.round(numerator / denominator);
            result /= 12;
            let minSalary = Math.round(result / 0.40);
            let financePorcentaje = Math.round((montoSolicitar / valor) * 100);


            let html = `<div class="border p-3 mb-3" id="resultados">
                            <div class="form-group mb-3 resultado">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="addon1">Pago Mensual</span>
                                    </div>
                                    <input type="text" class="form-control" readonly value="${formatter.format(result)}"/>
                                </div>
                            </div>
                            <div class="form-group mb-3 resultado">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="addon1">Salario Minimo</span>
                                    </div>
                                    <input type="text" class="form-control" readonly value="${formatter.format(minSalary)}"/>
                                </div>
                            </div>`;

            html += `<label class="resultado">${neto >= minSalary ? "Monto de salario suficiente para el crédito" : "Monto de salario insuficiente"}</label>`;

            html += `<hr><label class="resultado">${CalculateAge(fecha) > 22 && CalculateAge(fecha) < 55 ? "Cliente con edad suficiente para crédito" : "Cliente no califica para crédito por edad"}</label>`;

            html += `<hr><label class="resultado">Porcentaje a financiar: ${financePorcentaje}%</label></div>`;

            let form = document.getElementById("formularioInner");

            form.innerHTML += html;

            UpdateForm();

            let botones = document.getElementById("botones");
            botones.innerHTML = `<button type="button" onclick="Calculate()" class="btn btn-b col" id="calcular">Calcular</button>
                                 <button type="button" onclick="DisplayTable(${tasa}, ${result}, ${montoSolicitar}, ${plazo})" class="btn btn-b col" id="tabla">Mostrar Proyección</button>`;

        }

    } catch (error) {
        console.log(error);
    }
}

function CalculateAge(fecha) {

    let today = new Date();
    let birthday = new Date(fecha);
    let age = today.getFullYear() - birthday.getFullYear();
    let month = today.getMonth() - birthday.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    return age;
}

function UpdateForm() {

    if (data = window.localStorage.getItem("data") != null) {

        try {

            let email = document.getElementById("correo");
            let nombre = document.getElementById("nombre");
            let fecha = document.getElementById("fecha");
            let neto = document.getElementById("neto");
            let tasa = document.getElementById("tasa");
            let plazo = document.getElementById("plazo");
            let valor = document.getElementById("valor");
            let montoSolicitar = document.getElementById("montoSolicitar");
            let rango = document.getElementById("rango");

            let data = JSON.parse(window.localStorage.getItem('data'));

            email.value = data.email;
            nombre.value = data.nombre;
            fecha.value = data.fecha;
            neto.value = data.neto;
            tasa.value = data.tasa;
            plazo.value = data.plazo;
            rango.value = data.plazo;
            valor.value = data.valor;
            montoSolicitar.value = data.montoSolicitar;

        } catch (error) {
            console.log(error)
        }

    }
}

function DisplayTable(tasaMensual, pagoMensual, montoSolicitado, plazo) {
    try {

        let table = `<div class="border p-3 mb-3"><h6 class="text-center mb-0">Crédito Happy Eart</h6>
                     <br>
                     <h6 class="text-center mt-0">Proyección de Crédito</h6>
                     <div class="table-wrapper-scroll-y my-custom-scrollbar"><table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Mes</th>
                                <th scope="col">Pago Mensual</th>
                                <th scope="col">Intereses</th>
                                <th scope="col">Amortización</th>
                                <th scope="col">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>`


        var interes = 0;
        var amortiza = 0;
        let saldo = montoSolicitado;
        const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });

        for (var i = 1; i <= plazo * 12; i++) {

            interes = Intereses(tasaMensual, i, pagoMensual, montoSolicitado);
            amortiza = Math.round(pagoMensual - interes);
            saldo -= Math.round(amortiza);

            table += `<tr>
                        <td scope="row">${i}</td>
                        <td>${formatter.format(pagoMensual)}</td>
                        <td>${formatter.format(interes)}</td>
                        <td>${formatter.format(amortiza)}</td>
                        <td>${formatter.format(saldo)}</td>
                      </tr>`;
        }

        table += "</tbody></table></div></div>";

        let tabla = document.getElementById("tablaMostrar");
        tabla.innerHTML = table;

    } catch (error) {
        console.log(error);
    }
}

function Intereses(tasaMensual, mes, pagoMensual, montoSolicitado) {
    var interes = 0;
    var amortiza = montoSolicitado;

    for (var i = 1; i <= mes; i++) {
        interes = (amortiza * (tasaMensual / 100));
        amortiza = amortiza - (pagoMensual - interes);
    }

    return Math.round(interes / 12);
}