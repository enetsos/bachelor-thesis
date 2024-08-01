import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import TimeTrackingService from '../services/TimeTrackingService';
import { TimeTrackingAttributes } from '../types';

interface TimeTrackingContextProps {
    timeTracking: TimeTrackingAttributes[];
    currentTimeTracking: TimeTrackingAttributes | null;
    fetchTimeTracking: () => Promise<void>;
    fetchTimeTrackingByClient: (clientId: string) => Promise<void>;
    fetchTimeTrackingByEmployee: (employeeId: string) => Promise<void>;
    getTimeTrackingById: (timeTrackingId: string) => Promise<TimeTrackingAttributes>;
    createTimeTracking: (data: Partial<TimeTrackingAttributes>) => Promise<void>;
    updateTimeTracking: (timeTrackingId: string, timeTracking: Partial<TimeTrackingAttributes>) => Promise<TimeTrackingAttributes>;
    loading: boolean;
}

const TimeTrackingContext = createContext<TimeTrackingContextProps | undefined>(undefined);

export const useTimeTracking = (): TimeTrackingContextProps => {
    const context = useContext(TimeTrackingContext);
    if (!context) {
        throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
    }
    return context;
};

export const TimeTrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [timeTracking, setTimeTracking] = useState<TimeTrackingAttributes[]>([]);
    const [currentTimeTracking, setCurrentTimeTracking] = useState<TimeTrackingAttributes | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Function to fetch the current time tracking record
    const fetchTimeTracking = async () => {
        setLoading(true);
        try {
            const trackingData = await TimeTrackingService.getAllTimeTracking();
            setTimeTracking(trackingData); // Assuming the first record is the current one
        } catch (error) {
            console.error('Error fetching current time tracking:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch time tracking records by client ID
    const fetchTimeTrackingByClient = async (clientId: string) => {
        setLoading(true);
        try {
            const trackingData = await TimeTrackingService.getTimeTrackingByClient(clientId);
            setTimeTracking(trackingData);
        } catch (error) {
            console.error('Error fetching time tracking by client:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimeTrackingByEmployee = async (employeeId: string) => {
        setLoading(true);
        try {
            const trackingData = await TimeTrackingService.getTimeTrackingByEmployee(employeeId);
            setTimeTracking(trackingData);
        } catch (error) {
            console.error('Error fetching time tracking by employee:', error);
        } finally {
            setLoading(false);
        }
    }

    const getTimeTrackingById = async (timeTrackingId: string): Promise<TimeTrackingAttributes> => {
        setLoading(true);
        try {
            const trackingData = await TimeTrackingService.getTimeTrackingById(timeTrackingId);
            return trackingData;
        } catch (error) {
            console.error('Error fetching time tracking by id:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const createTimeTracking = async (data: Partial<TimeTrackingAttributes>) => {
        setLoading(true);
        try {
            const currentTimeTracking = await TimeTrackingService.createTimeTracking(data);
            setCurrentTimeTracking(currentTimeTracking);
            await fetchTimeTracking();
        } catch (error) {
            console.error('Error creating time tracking:', error);
        } finally {
            setLoading(false);
        }
    }

    const updateTimeTracking = async (timeTrackingId: string, timeTracking: Partial<TimeTrackingAttributes>): Promise<TimeTrackingAttributes> => {
        setLoading(true);
        try {
            const stoppedTimeTracking = await TimeTrackingService.updateTimeTracking(timeTrackingId, timeTracking);
            setCurrentTimeTracking(stoppedTimeTracking);
            await fetchTimeTracking();
            return stoppedTimeTracking;
        } catch (error) {
            console.error('Error stopping time tracking:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
    }, []);

    return (
        <TimeTrackingContext.Provider value={{
            timeTracking,
            currentTimeTracking,
            fetchTimeTracking,
            fetchTimeTrackingByClient,
            fetchTimeTrackingByEmployee,
            getTimeTrackingById,
            createTimeTracking,
            updateTimeTracking,
            loading
        }}>
            {children}
        </TimeTrackingContext.Provider>
    );
};
