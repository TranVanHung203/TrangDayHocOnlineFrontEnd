// src/HomePage.js

import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Card, CardContent, Grid, TextField, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';

const courses = [
    { id: 1, title: 'Các công nghệ phần mềm mới', group: 'Nhóm 08', semester: '2024-2025 Học Kỳ 1' },
    { id: 2, title: 'Chuyên đề Doanh nghiệp', group: 'Nhóm 01', semester: '2024-2025 Học Kỳ 1' },
    { id: 3, title: 'Kiểm thử phần mềm', group: 'Nhóm 03', semester: '2024-2025 Học Kỳ 1', progress: '18% complete' }
];

const HomePage = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: '#0D47A1' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        UTex
                    </Typography>
                    <IconButton color="inherit">
                        <LanguageIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <FacebookIcon />
                    </IconButton>
                    <Button color="inherit">Trang chủ</Button>
                    <Button color="inherit">Bảng Điều khiển</Button>
                    <Button color="inherit">Các khóa học của tôi</Button>
                </Toolbar>
            </AppBar>

            {/* Header */}
            <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4">Chào mừng quay trở lại, Nguyen Nhat! 👋</Typography>
            </Box>

            {/* Course Overview */}
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Tổng quan về khóa học
                </Typography>

                {/* Bộ lọc và tìm kiếm */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={3}>
                        <TextField select fullWidth label="All">
                            <MenuItem value="all">All</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Tìm kiếm" />
                    </Grid>
                    <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="outlined">Sort by course name</Button>
                        <Button variant="outlined">Card</Button>
                    </Grid>
                </Grid>

                {/* Danh sách khóa học */}
                <Grid container spacing={2}>
                    {courses.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{course.title}</Typography>
                                    <Typography variant="subtitle1">{course.group}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {course.semester}
                                    </Typography>
                                    {course.progress && (
                                        <Typography variant="body2" color="primary">
                                            {course.progress}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
