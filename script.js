let products = JSON.parse(localStorage.getItem("products")) || [];
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
let adminPassword = localStorage.getItem("adminPassword") || "admin123";

// ضبط نوع المستخدم (موظف أو أدمن)
function setUserType(userType) {
    if (userType === "employee") {
        document.getElementById("userTypeSection").style.display = "none";
        document.getElementById("employeeSection").style.display = "block";
        updateProductTable();
    } else {
        document.getElementById("userTypeSection").style.display = "none";
        document.getElementById("loginSection").style.display = "block";
    }
}

// تسجيل الدخول للأدمن
function login() {
    const password = document.getElementById("adminPassword").value;
    if (password === adminPassword) {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("adminSection").style.display = "block";
        updateProductTable();
        displayInvoices();
    } else {
        document.getElementById("loginError").textContent = "كلمة المرور غير صحيحة.";
    }
}

// تغيير كلمة المرور
function changePassword() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword === confirmPassword) {
        adminPassword = newPassword;
        localStorage.setItem("adminPassword", newPassword);
        document.getElementById("passwordMessage").textContent = "تم تغيير كلمة المرور بنجاح.";
    } else {
        document.getElementById("passwordMessage").textContent = "كلمة المرور الجديدة غير متطابقة.";
    }
}

// إضافة منتج جديد (للأدمن فقط)
function addProduct() {
    const name = document.getElementById("productName").value;
    const quantity = parseInt(document.getElementById("productQuantity").value);
    const price = parseFloat(document.getElementById("productPrice").value);

    products.push({ name, quantity, price });
    localStorage.setItem("products", JSON.stringify(products));
    updateProductTable();
}

// تحديث عرض المنتجات في جدول المخزن
function updateProductTable() {
    const table = document.getElementById("productTable").getElementsByTagName("tbody")[0];
    table.innerHTML = "";
    products.forEach(product => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = product.name;
        newRow.insertCell(1).textContent = product.quantity;
        newRow.insertCell(2).textContent = product.price.toFixed(2);
    });
}

// إضافة إلى الفاتورة (الموظف)
function addToInvoice() {
    const name = document.getElementById("invoiceProduct").value;
    const quantity = parseInt(document.getElementById("invoiceQuantity").value);
    const product = products.find(p => p.name === name);

    // التحقق من صحة البيانات المدخلة
    if (!name || isNaN(quantity) || quantity <= 0) {
        alert("يرجى إدخال اسم المنتج والكمية بشكل صحيح.");
        return;
    }

    // التحقق من وجود المنتج في المخزن
    if (!product) {
        alert("المنتج غير موجود في المخزن.");
        return;
    }

    // التحقق من توفر الكمية المطلوبة
    if (quantity > product.quantity) {
        alert("الكمية غير كافية في المخزن.");
        return;
    }

    // تقليل الكمية من المخزن
    product.quantity -= quantity;

    // إضافة الفاتورة إلى قائمة الفواتير
    const invoiceItem = {
        name: name,
        quantity: quantity,
        total: product.price * quantity
    };
    invoices.push(invoiceItem);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("products", JSON.stringify(products));

    // تحديث عرض المنتجات والفواتير
    updateProductTable();
    displayInvoices();

    // مسح الحقول
    document.getElementById("invoiceProduct").value = "";
    document.getElementById("invoiceQuantity").value = "";

    alert("تمت إضافة الفاتورة بنجاح.");
}
// دالة لتحديث عرض المنتجات في جدول المخزن
function updateProductTable() {
    const table = document.getElementById("productTable").getElementsByTagName("tbody")[0];
    table.innerHTML = ""; // مسح المحتوى القديم

    products.forEach(product => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = product.name;
        newRow.insertCell(1).textContent = product.quantity;
        newRow.insertCell(2).textContent = product.price.toFixed(2);
    });
}
// عرض الفواتير التي تم إنشاؤها
function displayInvoices() {
    const invoiceHistory = document.getElementById("invoiceHistory");
    invoiceHistory.innerHTML = "";

    invoices.forEach((invoice, index) => {
        const li = document.createElement("li");
        li.textContent = `فاتورة ${index + 1}: المنتج - ${invoice.name}, الكمية - ${invoice.quantity}, الإجمالي - ${invoice.total.toFixed(2)} دينار`;
        invoiceHistory.appendChild(li);
        
    });
}
// دالة لطباعة الفاتورة التي تم إضافتها
function printInvoice() {
    if (invoices.length === 0) {
        alert("لا توجد فواتير للطباعة.");
        return;
    }

    // الحصول على آخر فاتورة تمت إضافتها
    const lastInvoice = invoices[invoices.length - 1];

    // إنشاء نافذة جديدة لطباعة الفاتورة
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
            <head>
                <title>فاتورة المبيعات</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .total { font-weight: bold; text-align: right; }
                </style>
            </head>
            <body>
                <h2>فاتورة المبيعات</h2>
                <table>
                    <thead>
                        <tr>
                            <th>اسم المنتج</th>
                            <th>الكمية</th>
                            <th>السعر الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${lastInvoice.name}</td>
                            <td>${lastInvoice.quantity}</td>
                            <td>${lastInvoice.total.toFixed(2)} دينار</td>
                        </tr>
                    </tbody>
                </table>
                <p class="total">الإجمالي: ${lastInvoice.total.toFixed(2)} دينار</p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}
// عرض الفواتير في قائمة للاختيار
function displayInvoicesInSelect() {
    const invoiceSelect = document.getElementById("invoiceSelect");
    invoiceSelect.innerHTML = "<option value=''>اختر الفاتورة</option>";
    invoices.forEach((invoice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `فاتورة ${index + 1}: المنتج - ${invoice.name}, الكمية - ${invoice.quantity}`;
        invoiceSelect.appendChild(option);
        
    });
}

// مراجعة الفاتورة المختارة
function reviewInvoice() {
    const selectedIndex = document.getElementById("invoiceSelect").value;
    if (selectedIndex === "") {
        alert("يرجى اختيار الفاتورة.");
        return;
    }

    const selectedInvoice = invoices[selectedIndex];
    document.getElementById("reviewSection").style.display = "block";
    const reviewInvoiceDetails = document.getElementById("reviewInvoiceDetails");
    reviewInvoiceDetails.innerHTML = `
        <li>اسم المنتج: ${selectedInvoice.name}</li>
        <li>الكمية: ${selectedInvoice.quantity}</li>
        <li>السعر الإجمالي: ${selectedInvoice.total.toFixed(2)} دينار</li>
    `;
}

// إرجاع المنتجات إلى المخزن
function processReturn() {
    const selectedIndex = document.getElementById("invoiceSelect").value;
    const returnQuantity = parseInt(document.getElementById("returnQuantity").value);

    if (isNaN(returnQuantity) || returnQuantity <= 0) {
        document.getElementById("returnMessage").textContent = "يرجى إدخال كمية صحيحة للإرجاع.";
        document.getElementById("returnMessage").style.color = "red";
        return;
    }

    const selectedInvoice = invoices[selectedIndex];
    const product = products.find(p => p.name === selectedInvoice.name);

    if (!product) {
        alert("المنتج غير موجود في المخزن.");
        return;
    }

    // تحقق من أن كمية الإرجاع لا تتجاوز الكمية الأصلية
    if (returnQuantity > selectedInvoice.quantity) {
        document.getElementById("returnMessage").textContent = "كمية الإرجاع أكبر من الكمية الأصلية.";
        document.getElementById("returnMessage").style.color = "red";
        return;
    }

    // إرجاع الكمية إلى المخزن وتحديث الفاتورة
    product.quantity += returnQuantity;
    selectedInvoice.quantity -= returnQuantity;

    if (selectedInvoice.quantity === 0) {
        invoices.splice(selectedIndex, 1); // إزالة الفاتورة إذا كانت الكمية 0
    }

    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("invoices", JSON.stringify(invoices));
    updateProductTable();
    displayInvoices();
    displayInvoicesInSelect();

    document.getElementById("returnMessage").textContent = "تم إرجاع المنتج بنجاح.";
    document.getElementById("returnMessage").style.color = "green";
    document.getElementById("returnQuantity").value = "";
}
// عرض الفواتير عند تحميل الصفحة
displayInvoicesInSelect();
let returns = JSON.parse(localStorage.getItem("returns")) || [];

// إرجاع المنتجات إلى المخزن
function processReturn() {
    const selectedIndex = document.getElementById("invoiceSelect").value;
    const returnQuantity = parseInt(document.getElementById("returnQuantity").value);

    if (isNaN(returnQuantity) || returnQuantity <= 0) {
        document.getElementById("returnMessage").textContent = "يرجى إدخال كمية صحيحة للإرجاع.";
        document.getElementById("returnMessage").style.color = "red";
        return;
    }

    const selectedInvoice = invoices[selectedIndex];
    const product = products.find(p => p.name === selectedInvoice.name);

    if (!product) {
        alert("المنتج غير موجود في المخزن.");
        return;
    }

    // تحقق من أن كمية الإرجاع لا تتجاوز الكمية الأصلية
    if (returnQuantity > selectedInvoice.quantity) {
        document.getElementById("returnMessage").textContent = "كمية الإرجاع أكبر من الكمية الأصلية.";
        document.getElementById("returnMessage").style.color = "red";
        return;
    }

    // إرجاع الكمية إلى المخزن وتحديث الفاتورة
    product.quantity += returnQuantity;
    selectedInvoice.quantity -= returnQuantity;

    // إضافة السجل إلى سجل المرتجعات
    returns.push({
        name: selectedInvoice.name,
        quantity: returnQuantity,
        price: product.price
    });
    localStorage.setItem("returns", JSON.stringify(returns));

    if (selectedInvoice.quantity === 0) {
        invoices.splice(selectedIndex, 1); // إزالة الفاتورة إذا كانت الكمية 0
    }

    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("invoices", JSON.stringify(invoices));
    updateProductTable();
    displayInvoices();
    displayInvoicesInSelect();
    updateReturnsTable(); // تحديث جدول المرتجعات

    document.getElementById("returnMessage").textContent = "تم إرجاع المنتج بنجاح.";
    document.getElementById("returnMessage").style.color = "green";
    document.getElementById("returnQuantity").value = "";
}

// دالة لتحديث جدول المرتجعات
function updateReturnsTable() {
    const returnsTable = document.getElementById("returnsTable").getElementsByTagName("tbody")[0];
    returnsTable.innerHTML = "";

    returns.forEach(returnItem => {
        const newRow = returnsTable.insertRow();
        newRow.insertCell(0).textContent = returnItem.name;
        newRow.insertCell(1).textContent = returnItem.quantity;
        newRow.insertCell(2).textContent = returnItem.price.toFixed(2);
    });
}
// عرض المرتجعات عند تحميل الصفحة
updateReturnsTable();
let archivedInvoices = JSON.parse(localStorage.getItem("archivedInvoices")) || [];

// دالة لبدء يوم جديد
function startNewDay() {
    if (invoices.length === 0) {
        alert("لا توجد فواتير حالية لحفظها.");
        return;
    }

    // تأكيد عملية بدء يوم جديد
    const confirmNewDay = confirm("هل أنت متأكد من بدء يوم جديد؟ سيتم حفظ الفواتير الحالية في الأرشيف وإفراغ القائمة.");
    if (!confirmNewDay) {
        return;
    }

    // إضافة الفواتير الحالية إلى الأرشيف مع تاريخ اليوم
    const currentDate = new Date().toLocaleDateString();
    archivedInvoices.push({
        date: currentDate,
        invoices: [...invoices]
    });

    // تحديث التخزين في localStorage
    localStorage.setItem("archivedInvoices", JSON.stringify(archivedInvoices));

    // إفراغ قائمة الفواتير الحالية
    invoices = [];
    localStorage.setItem("invoices", JSON.stringify(invoices));

    // تحديث عرض الفواتير
    displayInvoices();
    updateTotalSalesDisplay();

    // إظهار رسالة التأكيد
    document.getElementById("newDayMessage").textContent = "تم بدء يوم جديد وحفظ الفواتير في الأرشيف بنجاح.";
}
// دالة لعرض الفواتير المؤرشفة
function displayArchivedInvoices() {
    const archivedInvoicesTable = document.getElementById("archivedInvoicesTable").getElementsByTagName("tbody")[0];
    archivedInvoicesTable.innerHTML = "";

    archivedInvoices.forEach(archive => {
        const archiveDateRow = archivedInvoicesTable.insertRow();
        archiveDateRow.insertCell(0).textContent = `التاريخ: ${archive.date}`;
        archiveDateRow.insertCell(1).textContent = '';
        archiveDateRow.insertCell(2).textContent = '';
        archiveDateRow.insertCell(3).textContent = '';

        archive.invoices.forEach(invoice => {
            const newRow = archivedInvoicesTable.insertRow();
            newRow.insertCell(0).textContent = invoice.name;
            newRow.insertCell(1).textContent = invoice.quantity;
            newRow.insertCell(2).textContent = invoice.total.toFixed(2);
            newRow.insertCell(3).textContent = archive.date;
        });
    });
}
// عرض الفواتير عند تحميل الصفحة
updateTotalSalesDisplay();
displayInvoices();
displayArchivedInvoices();
// دالة لحفظ الفواتير الحالية تلقائيًا عند بداية يوم جديد
function autoArchiveInvoices() {
    const currentDate = new Date().toLocaleDateString();

    // التحقق مما إذا كانت الفواتير قد تم حفظها بالفعل اليوم
    const lastArchiveDate = localStorage.getItem("lastArchiveDate");
    if (lastArchiveDate === currentDate) {
        return; // إذا تم الحفظ اليوم، لا داعي لإعادة الحفظ
    }

    // حفظ الفواتير الحالية في الأرشيف
    if (invoices.length > 0) {
        archivedInvoices.push({
            date: currentDate,
            invoices: [...invoices]
        });

        // تحديث التخزين في localStorage
        localStorage.setItem("archivedInvoices", JSON.stringify(archivedInvoices));
        invoices = [];
        localStorage.setItem("invoices", JSON.stringify(invoices));

        // تخزين تاريخ آخر حفظ
        localStorage.setItem("lastArchiveDate", currentDate);

        // تحديث عرض البيانات
        displayInvoices();
        updateArchivedInvoicesTable();
        updateTotalSalesDisplay();

        console.log("تم حفظ الفواتير تلقائيًا في الأرشيف.");
    }
}
// دالة لتحديث عرض الفواتير المؤرشفة
function updateArchivedInvoicesTable() {
    const archivedInvoicesTable = document.getElementById("archivedInvoicesTable").getElementsByTagName("tbody")[0];
    archivedInvoicesTable.innerHTML = "";

    archivedInvoices.forEach(archive => {
        const archiveDateRow = archivedInvoicesTable.insertRow();
        archiveDateRow.insertCell(0).textContent = `التاريخ: ${archive.date}`;
        archiveDateRow.insertCell(1).textContent = '';
        archiveDateRow.insertCell(2).textContent = '';
        archiveDateRow.insertCell(3).textContent = '';

        archive.invoices.forEach(invoice => {
            const newRow = archivedInvoicesTable.insertRow();
            newRow.insertCell(0).textContent = invoice.name;
            newRow.insertCell(1).textContent = invoice.quantity;
            newRow.insertCell(2).textContent = invoice.total.toFixed(2);
            newRow.insertCell(3).textContent = archive.date;
        });
    });
}

// استدعاء دوال التحديث عند تحميل الصفحة
updateTotalSalesDisplay();
displayInvoices();
updateArchivedInvoicesTable();
// دالة لحذف المنتج من المخزن
function deleteProduct(index) {
    // تأكيد عملية الحذف
    const confirmDelete = confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (!confirmDelete) {
        return;
    }

    // حذف المنتج من المصفوفة
    products.splice(index, 1);

    // تحديث التخزين في localStorage
    localStorage.setItem("products", JSON.stringify(products));

    // تحديث عرض المنتجات في الجدول
    updateProductTable();

    alert("تم حذف المنتج بنجاح.");
}
// دالة لتحديث عرض المنتجات في جدول المخزن
function updateProductTable() {
    const table = document.getElementById("productTable").getElementsByTagName("tbody")[0];
    table.innerHTML = ""; // مسح المحتوى القديم

    products.forEach((product, index) => {
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = product.name;
        newRow.insertCell(1).textContent = product.quantity;
        newRow.insertCell(2).textContent = product.price.toFixed(2);

        // إضافة زر الحذف
        const actionCell = newRow.insertCell(3);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "حذف";
        deleteButton.onclick = () => deleteProduct(index);
        actionCell.appendChild(deleteButton);
    });
}
// دالة للبحث عن المنتج باستخدام كود الباركود
function findProductByCode() {
    const code = document.getElementById("productCode").value;
    const product = products.find(p => p.code === code);

    if (product) {
        document.getElementById("invoiceProduct").value = product.name;
    } else {
        document.getElementById("invoiceProduct").value = "";
    }
}
// دالة لإضافة المنتجات إلى الفاتورة
function addToInvoice() {
    const code = document.getElementById("productCode").value.trim();
    const quantity = parseInt(document.getElementById("invoiceQuantity").value);

    // التحقق من صحة البيانات المدخلة
    if (!code) {
        alert("يرجى إدخال كود المنتج.");
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        alert("يرجى إدخال كمية صحيحة.");
        return;
    }

    // البحث عن المنتج باستخدام الكود
    const product = products.find(p => p.code === code);
    if (!product) {
        alert("المنتج غير موجود.");
        return;
    }

    // التحقق من توفر الكمية
    if (quantity > product.quantity) {
        alert("الكمية غير كافية.");
        return;
    }

    // تقليل الكمية في المخزن
    product.quantity -= quantity;

    // إضافة الفاتورة إلى قائمة الفواتير
    const invoice = { name: product.name, quantity, total: product.price * quantity };
    invoices.push(invoice);

    // تحديث التخزين في localStorage
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("products", JSON.stringify(products));

    // تحديث عرض الفواتير والمخزن
    displayInvoices();
    updateProductTable();
    updateTotalSalesDisplay();

    // مسح الحقول
    document.getElementById("productCode").value = "";
    document.getElementById("invoiceProduct").value = "";
    document.getElementById("invoiceQuantity").value = "";
}
// دالة لإضافة المنتجات إلى الفاتورة
function addToInvoice() {
    const code = document.getElementById("productCode").value.trim();
    const quantity = parseInt(document.getElementById("invoiceQuantity").value);

    // التحقق من صحة البيانات المدخلة
    if (!code) {
        alert("يرجى إدخال كود المنتج.");
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        alert("يرجى إدخال كمية صحيحة.");
        return;
    }

    // البحث عن المنتج باستخدام الكود
    const product = products.find(p => p.code === code);
    if (!product) {
        alert("المنتج غير موجود.");
        return;
    }

    // التحقق من توفر الكمية
    if (quantity > product.quantity) {
        alert("الكمية غير كافية.");
        return;
    }

    // تقليل الكمية في المخزن
    product.quantity -= quantity;

    // إضافة الفاتورة إلى قائمة الفواتير
    const invoice = { name: product.name, quantity, total: product.price * quantity };
    invoices.push(invoice);

    // تحديث التخزين في localStorage
    localStorage.setItem("invoices", JSON.stringify(invoices));
    localStorage.setItem("products", JSON.stringify(products));

    // تحديث عرض الفواتير والمخزن
    displayInvoices();
    updateProductTable();
    updateTotalSalesDisplay();

    // عرض رسالة النجاح
    showSuccessMessage();

    // مسح الحقول
    document.getElementById("productCode").value = "";
    document.getElementById("invoiceProduct").value = "";
    document.getElementById("invoiceQuantity").value = "";
}

// دالة لعرض رسالة النجاح
function showSuccessMessage() {
    const successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block";

    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        successMessage.style.display = "none";
    }, 3000);
}
