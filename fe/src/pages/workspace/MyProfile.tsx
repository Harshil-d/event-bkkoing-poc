import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, Breadcrumbs, Link, TabList, Tabs, Typography } from '@mui/joy';
import Tab, { tabClasses } from '@mui/joy/Tab';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import PersonalInfo from '../../components/MyProfile/PersonalInfo';
import Address from '../../components/MyProfile/Address';
import Security from '../../components/MyProfile/Security';

const MyProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<string>('personal-info');

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
            <Typography color='primary' sx={{ fontWeight: 500, fontSize: 12 }}>
              My Profile
            </Typography>
          </Breadcrumbs>
          <Typography level='h2' component='h1' sx={{ mt: 1, mb: 2 }}>
            My Profile
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
              value={'personal-info'}
            >
              Personal Info
            </Tab>
            <Tab
              sx={{ borderRadius: '6px 6px 0 0' }}
              indicatorInset
              value={'address'}
            >
              Address
            </Tab>
            <Tab
              sx={{ borderRadius: '6px 6px 0 0' }}
              indicatorInset
              value={'security'}
            >
              Security
            </Tab>
          </TabList>

          <div
            style={{
              display: selectedTab === 'personal-info' ? 'block' : 'none',
            }}
          >
            <PersonalInfo />
          </div>
          <div
            style={{ display: selectedTab === 'address' ? 'block' : 'none' }}
          >
            <Address />
          </div>
          <div
            style={{ display: selectedTab === 'security' ? 'block' : 'none' }}
          >
            <Security />
          </div>
        </Tabs>
      </Box>
    </Box>
  );
};

export default MyProfilePage;
