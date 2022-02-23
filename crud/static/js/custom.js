function showData() {
    let outPut = '';
    axios.get('http://127.0.0.1:8000/student-list').then(res => {
        let student_data = res.data;
        student_data.forEach((student, key) => {
            outPut += `<tr>
                            <td>${++key}</td>
                            <td>${student.name}</td>
                            <td>${student.address}</td>
                            <td>${student.phone}</td>
                            <td>
                            <button onclick="editStudent(${student.id})">Edit</button>
                            <button onclick="deleteStudent(${student.id})">Delete</button>
                            </td>
                          
                    </tr>`;
        });
        document.getElementById('student_list').innerHTML = outPut;
    }).catch(err => {
        console.log(err);
    });


}

showData();

// insert data

document.querySelector('#addRecord').addEventListener('click', function (e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    if (name == '') {
        document.getElementById('error_message').innerHTML = "Name filed is required";
        return false;
    }
    let address = document.getElementById('address').value;
    let phone = document.getElementById('phone').value;
    let sendData = new FormData();
    sendData.append('name', name)
    sendData.append('address', address)
    sendData.append('phone', phone)
    let criteria = document.getElementById('criteria').value;
    if (criteria !== '') {
        axios.post('http://127.0.0.1:8000/edit-student/' + criteria, sendData).then(res => {
            document.getElementById('name').value = '';
            document.getElementById('address').value = '';
            document.getElementById('phone').value = '';
            Swal.fire({
                icon: 'success', title: res.data.success, showConfirmButton: false, timer: 1500
            })
            document.getElementById('addRecord').innerHTML = "Add record";
            return showData();

        }).catch(err => {
            console.log(err)
        })
    } else {
        axios.post('http://127.0.0.1:8000/add-student', sendData).then(res => {
            document.getElementById('name').value = '';
            document.getElementById('address').value = '';
            document.getElementById('phone').value = '';
            Swal.fire({
                icon: 'success', title: res.data.success, showConfirmButton: false, timer: 1500
            })
            return showData();

        }).catch(err => {
            console.log(err)
        })
    }


});

function deleteStudent(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.get('http://127.0.0.1:8000/delete-student/' + id).then(res => {
                Swal.fire({
                    icon: 'success', title: res.data.success, showConfirmButton: false, timer: 1500
                })
                return showData();
            }).catch(err => {
                console.log(err)
            })

        }
    })

}

function editStudent(id) {
    axios.get('http://127.0.0.1:8000/edit-student/' + id).then(res => {
        let data = res.data;
        document.getElementById('name').value = data.name;
        document.getElementById('address').value = data.address;
        document.getElementById('phone').value = data.phone;
        document.getElementById('criteria').value = data.id;
        document.getElementById('addRecord').innerHTML = "Update Record";

    });

}