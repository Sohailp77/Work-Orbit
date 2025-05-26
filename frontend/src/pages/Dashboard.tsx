import React, { useState, useEffect } from 'react';
import { Card, Col, Row, List, Typography, Button, Tag, Space } from 'antd';
import YourTeams from '../components/teams/yourTeams';
import YourTask from '../components/task/yourTask';
export const Dashboard: React.FC = () => {


  return (
    <div className="p-6 mt-4">
      <Typography.Title level={4} className="mb-6">Dashboard Overview</Typography.Title>
      
      {/* Stats Section */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} md={8}>
          <Card className="shadow-sm rounded-lg border border-gray-200 bg-white">
            <Space direction="vertical">
              <Typography.Text type="secondary">Completed Tasks</Typography.Text>
              <Typography.Title level={2}>*</Typography.Title>
              <Typography.Text type="success">* this week</Typography.Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm rounded-lg border border-gray-200 bg-white">
            <Space direction="vertical">
              <Typography.Text type="secondary">Upcoming Deadlines</Typography.Text>
              <Typography.Title level={2}>*</Typography.Title>
              <Typography.Text type="warning">* urgent</Typography.Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm rounded-lg border border-gray-200 bg-white">
            <Space direction="vertical">
              <Typography.Text type="secondary">Team Messages</Typography.Text>
              <Typography.Title level={2}>*</Typography.Title>
              <Typography.Text>* unread</Typography.Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tasks Section */}
       
          <YourTask/>

          <YourTeams/>

      </div>
    </div>
  );
};
