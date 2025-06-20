import { MouseEvent, MouseEventHandler } from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLAnchorElement>,
        newPage: number,
    ) => void;
}

export default function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPagebuttonClick = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackPagebuttonClick = (
        event: MouseEvent<HTMLAnchorElement>,
    ) => {
        onPageChange(event, page - 1);
    };

    const handleNextPagebuttonClick = (
        event: MouseEvent<HTMLAnchorElement> ,
    ) => {
        onPageChange(event, page + 1);
    };

    const handleLastPagebuttonClick = (
        event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLAnchorElement>,
    ) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPagebuttonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            {/* <IconButton
                onClick={handleBackPagebuttonClick}
                disable={page === 0}
                arial-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextPagebuttonClick}
                disable={page === 0}
                arial-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
             <IconButton
                onClick={handleLastPagebuttonClick}
                disable={page === 0}
                arial-label="previous page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton> */}
        </Box>
    )
}