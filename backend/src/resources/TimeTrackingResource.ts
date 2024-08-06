import BaseResource from "./BaseResource";

class TimeTrackingResource extends BaseResource<TimeTrackingAttributes, TimeTrackingEntity>() {
    item() {
        const timeTrackingResource: TimeTrackingEntity = {
            id: this.instance.id,
            employeeId: this.instance.employeeId,
            clientId: this.instance.clientId,
            startTime: this.instance.startTime,
            endTime: this.instance.endTime,
            status: this.instance.status,
            longStartTime: this.instance.longStartTime,
            longEndTime: this.instance.longEndTime,
            latStartTime: this.instance.latStartTime,
            latEndTime: this.instance.latEndTime,
            notes: this.instance.notes
        };

        return timeTrackingResource;
    }
}

export default TimeTrackingResource;
