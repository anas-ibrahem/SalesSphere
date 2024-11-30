
import { Box } from '@mui/material';
import Link from '@mui/material/Link';

const FullLogo = () => (
    <Link href="/" underline="none">
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 

      }}
    >
      <img 
        src="SalesSphere.svg" 
        alt="Company Logo" 
        style={{ 
          maxWidth: '200px', 
          height: 'auto' 
        }} 
      />
    </Box>
    </Link>
);

export default FullLogo;