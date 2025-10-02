import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Box, Breadcrumbs, Link, TabList, Tabs, Typography } from '@mui/joy';
import Tab, { tabClasses } from '@mui/joy/Tab';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';

import ClientBasicDetails from '../../components/Clients/ClientBasicDetails';
import ClientAddress from '../../components/Clients/ClientAddress';
import ClientPersonalSocialInfo from '../../components/Clients/ClientPersonalSocialInfo';
import ClientMedicalHistory from '../../components/Clients/ClientMedicalHistory';
import ClientDietaryHistory from '../../components/Clients/ClientDietaryHistory';

const UpdateClientsPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<string>('basic-details');

  const tab = searchParams.get('tab');

  const handleTabChange = (_: any, value: number | string | null) => {
    setSelectedTab(value as string);
    setSearchParams({ tab: value as string });
  };

  useEffect(() => {
    if (!tab) {
      setSearchParams({ tab: selectedTab });
    } else {
      if (tab !== selectedTab) {
        setSelectedTab(tab);
        setSearchParams({ tab });
      }
    }
  }, [tab, selectedTab, setSearchParams]);

  const clientId = +(id || 0);

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size='sm'
            aria-label='breadcrumbs'
            separator={<ChevronRightRoundedIcon />}
            sx={{ pl: 0 }}
          >
            <Link underline='none' color='neutral' href='/' aria-label='Home'>
              <HomeRoundedIcon />
            </Link>
            <Link
              underline='none'
              color='neutral'
              href='/clients'
              aria-label='Home'
            >
              Clients
            </Link>
            <Typography color='primary' sx={{ fontWeight: 500, fontSize: 12 }}>
              Update Client
            </Typography>
          </Breadcrumbs>
          <Typography level='h2' component='h1' sx={{ mt: 1, mb: 2 }}>
            Update Client
          </Typography>
        </Box>
        <Tabs
          value={tab || selectedTab}
          sx={{ bgcolor: 'transparent' }}
          onChange={handleTabChange}
        >
          <TabList
            tabFlex={1}
            size='sm'
            sx={{
              pl: { xs: 0, md: 4 },
              justifyContent: 'left',
              [`&& .${tabClasses.root}`]: {
                fontWeight: '600',
                flex: 'initial',
                color: 'text.tertiary',
                [`&.${tabClasses.selected}`]: {
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&::after': {
                    height: '2px',
                    bgcolor: 'primary.500',
                  },
                },
              },
            }}
          >
            <Tab
              sx={{ borderRadius: '6px 6px 0 0' }}
              indicatorInset
              value={'basic-details'}
            >
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <PersonRoundedIcon />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Basic Details
              </Box>
            </Tab>
            <Tab
              sx={{ borderRadius: '6px 6px 0 0' }}
              indicatorInset
              value={'address'}
            >
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <BusinessRoundedIcon />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Address</Box>
            </Tab>
            <Tab
              sx={{ borderRadius: '6px 6px 0 0' }}
              indicatorInset
              value={'personal-social'}
            >
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <LocalActivityRoundedIcon />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Personal & Social Information
              </Box>
            </Tab>
            <Tab
              sx={{ borderRadius: '6px 6px 0 0' }}
              indicatorInset
              value={'medical-history'}
            >
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MonitorHeartRoundedIcon />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Medical History
              </Box>
            </Tab>
            <Tab
              sx={{ borderRadius: '6px 6px 0 0' }}
              indicatorInset
              value={'dietary-history'}
            >
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <FastfoodRoundedIcon />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Dietary History
              </Box>
            </Tab>
          </TabList>

          <div
            style={{
              display: selectedTab === 'basic-details' ? 'block' : 'none',
            }}
          >
            <ClientBasicDetails id={clientId} />
          </div>
          <div
            style={{ display: selectedTab === 'address' ? 'block' : 'none' }}
          >
            <ClientAddress id={clientId} />
          </div>
          <div
            style={{
              display: selectedTab === 'personal-social' ? 'block' : 'none',
            }}
          >
            <ClientPersonalSocialInfo id={clientId} />
          </div>
          <div
            style={{
              display: selectedTab === 'medical-history' ? 'block' : 'none',
            }}
          >
            <ClientMedicalHistory id={clientId} />
          </div>
          <div
            style={{
              display: selectedTab === 'dietary-history' ? 'block' : 'none',
            }}
          >
            <ClientDietaryHistory id={clientId} />
          </div>
        </Tabs>
      </Box>
    </Box>
  );
};

export default UpdateClientsPage;
