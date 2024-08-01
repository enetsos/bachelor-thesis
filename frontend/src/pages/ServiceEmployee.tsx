import React, { useEffect, useState, useRef } from 'react';
import { Layout, Row, Col, Card, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTimeTracking } from '../context/TimeTrackingContext';
import Header from '../components/Header';
import BackArrow from '../components/BackArrow';
import { TimeTrackingAttributes, User } from '../types';
import { useUser } from '../context/UserContext';
import ServiceInfo from '../components/ServiceInfo';
import ClientInfo from '../components/ServiceClientInfo';
import StopButton from '../components/ServiceStopButton';

const { Content } = Layout;

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ServiceEmployee: React.FC = () => {
    const [client, setClient] = useState<User | null>(null);
    const [timeTracking, setTimeTracking] = useState<TimeTrackingAttributes | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [stopTime, setStopTime] = useState<string | null>(null);
    const { getTimeTrackingById, updateTimeTracking } = useTimeTracking();
    const { getUserById } = useUser();
    const query = useQuery();
    const navigate = useNavigate();
    const serviceId = query.get('id') || '';
    const isFetched = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if (isFetched.current) return;
            isFetched.current = true;
            setLoading(true);
            try {
                const timeTrackingData = await getTimeTrackingById(serviceId);
                setTimeTracking(timeTrackingData);
                console.log('Time Tracking Data:', timeTrackingData);
            } catch (error) {
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchData();
        }
    }, [serviceId, getTimeTrackingById]);

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true);
            if (timeTracking?.clientId) {
                try {
                    console.log('Fetching client data...');
                    const clientData = await getUserById(timeTracking.clientId);
                    setClient(clientData);
                    console.log('Client Data:', clientData);
                } catch (error) {
                    console.log('Error fetching client data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (timeTracking) {
            fetchClientData();
        }
    }, [timeTracking, getUserById]);

    const handleStop = async () => {
        if (serviceId && timeTracking?.status !== 'concluded' && timeTracking?.id) {
            setLoading(true);
            const now = new Date();
            setStopTime(now.toLocaleTimeString());
            try {
                const updatedTimeTracking = await updateTimeTracking(timeTracking.id, { endTime: now, status: 'concluded' });
                setTimeTracking(updatedTimeTracking);
            } catch (error) {
                console.log('Error stopping time tracking:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!serviceId) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header title="Service" />
                <BackArrow />
                <Content style={{ padding: '20px 50px' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} offset={6}>
                            <Card title="Error" bordered={false}>
                                <p>Service ID is required to fetch service details.</p>
                                <Button onClick={() => navigate(-1)}>Go Back</Button>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header title="Service Details" />
            <BackArrow />
            <Content style={{ padding: '20px 50px', position: 'relative' }}>
                {stopTime && (
                    <div style={{ position: 'absolute', top: 20, right: 50, fontSize: '18px' }}>
                        Service stopped at: {stopTime}
                    </div>
                )}
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12} offset={6}>
                        <Card title="Service Information" bordered={false}>
                            {timeTracking ? (
                                <>
                                    <ClientInfo client={client} />
                                    <ServiceInfo timeTracking={timeTracking} />
                                    <StopButton
                                        handleStop={handleStop}
                                        loading={loading}
                                        isConcluded={timeTracking.status === 'concluded'}
                                    />
                                </>
                            ) : (
                                <p>Loading service data...</p>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ServiceEmployee;
