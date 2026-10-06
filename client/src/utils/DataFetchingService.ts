import axios from "axios";


const api = axios.create({
    baseURL:  "/api/v1/",
    withCredentials: true,
});


const requestOptions = {
    withCredentials:true,
}

export async function fetchUserData() {

    const response = await api.get(`/protected/user`,
        requestOptions
    );
    return response.data;
};

export async function createTask(taskContent: {content: string, status: string}) {
    const requestBody = {
        "content" : taskContent.content,
        "status" : taskContent.status
    }
    const response = await api.post(`/protected/user/create-task`,
        requestBody,
        requestOptions

      );
      return response.data;
}


export async function removeTask(taskId: string) {
    
    const response = await api.delete(`/protected/user/delete-task?taskId=${taskId}`,
        requestOptions
      );
      return response.data;
}

export async function changeTaskStatus(taskContent: {taskId: string, newStatus: string}) {
    const requestBody = {
        "taskId" : taskContent.taskId,
        "newStatus" : taskContent.newStatus
    };

    const response = await api.patch(`/protected/user/update-task-status`,
        requestBody,
        requestOptions
      );

    return response.data;

}

export async function changeTaskContent(taskContent:{taskId: string, newContent: string}) {
    const requestBody = {
        "taskId" : taskContent.taskId,
        "newContent" : taskContent.newContent
    };

    const response = await api.patch(`/protected/user/update-task-content`,
        requestBody,
        requestOptions
      );
      
    return response.data;

}

export async function logout() {
    const response = await api.post(`/protected/logout`,
        requestOptions
      );
      
    return response.data;

}


