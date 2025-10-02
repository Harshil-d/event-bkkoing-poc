import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardOverflow,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from '@mui/joy';
import { InfoOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { ILookupItem } from '../../interfaces/lookup.interface';
import { uiActions } from '../../store/slices/ui.slice';
import { IDietitianGroupLink } from '../../interfaces/dietitianGroup.interface';
import { IFieldError } from '../../interfaces/forms.interface';
import { getDietitianGroupList } from '../../services/lookup.service';
import { constants } from '../../constants/index.constants';
import {
  getDietitianGroupLinks,
  updateDietitianGroupLinks,
} from '../../services/dietitianGroup.service';

const SocialPlatformDetails: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [linkTypes, setLinkTypes] = useState<ILookupItem[]>([]);
  const [links, setLinks] = useState<IDietitianGroupLink[]>([]);
  const [initialLinks, setInitialLinks] = useState<IDietitianGroupLink[]>([]);
  const [formErrors, setFormErrors] = useState<IFieldError[]>();

  useEffect(() => {
    if (isLoading) {
      dispatch(uiActions.addLoader());
    } else {
      dispatch(uiActions.removeLoader());
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    const fetchLinkTypes = async () => {
      setIsLoading(true);

      const response = await getDietitianGroupList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const linkTypes = response.payload || [];
        setLinkTypes(linkTypes);

        setLinks(
          linkTypes.map((linkType) => ({
            linkType: linkType.value,
            link: '',
          }))
        );

        setInitialLinks(
          linkTypes.map((linkType) => ({
            linkType: linkType.value,
            link: '',
          }))
        );

        return linkTypes;
      }

      setIsLoading(false);
    };

    const fetchDietitianGroupLinks = async (linkTypes: ILookupItem[]) => {
      setIsLoading(true);

      const response = await getDietitianGroupLinks();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const links = response.payload || [];

        setLinks(
          linkTypes.map((linkType) => ({
            linkType: linkType.value,
            link:
              links.find((link) => link.linkType === linkType.value)?.link ||
              '',
          }))
        );
        setInitialLinks(
          linkTypes.map((linkType) => ({
            linkType: linkType.value,
            link:
              links.find((link) => link.linkType === linkType.value)?.link ||
              '',
          }))
        );
      }

      setIsLoading(false);
    };

    const fetchData = async () => {
      const linkTypes = await fetchLinkTypes();
      await fetchDietitianGroupLinks(linkTypes || []);
    };

    fetchData();
  }, []);

  const discardAllChanges = () => {
    setLinks(initialLinks);
    setFormErrors([]);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinks((links) => {
      const linkIndex = links.findIndex(
        (link) => link.linkType === event.target.name
      );

      if (linkIndex !== -1) {
        links[linkIndex].link = event.target.value;
      }
      return [...links];
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await updateDietitianGroupLinks(links);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setInitialLinks(
        links.map((link) => ({
          ...link,
        }))
      );
      toast.success('Social platform details updated successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  return (
    <Stack
      spacing={4}
      sx={{
        display: 'flex',
        maxWidth: { xs: '100%', md: '1000px' },
        mx: { xs: 'auto', md: 'auto' },
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Card>
        <Stack direction='row' spacing={2} sx={{ display: 'flex', my: 1 }}>
          <Stack spacing={2} sx={{ flex: 1 }}>
            {linkTypes
              .reduce((result, link, index, array) => {
                if (index % 2 === 0) {
                  result.push(array.slice(index, index + 2));
                }
                return result;
              }, [] as ILookupItem[][])
              .map((pair, index) => (
                <Stack
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: { md: 'row', xs: 'column' },
                    gap: 2,
                  }}
                >
                  {pair.map((link, subIndex) => {
                    const formError = formErrors?.find(
                      (error) =>
                        error.name === link.value && error.showOnElement
                    );

                    return (
                      <FormControl
                        key={subIndex}
                        sx={{ flex: 1 }}
                        error={!!formError}
                      >
                        <FormLabel>{link.text}</FormLabel>
                        <Input
                          size='sm'
                          onChange={changeHandler}
                          slotProps={{
                            input: {
                              maxLength: 511,
                            },
                          }}
                          name={link.value}
                          value={
                            links.find((l) => l.linkType === link.value)
                              ?.link || ''
                          }
                        />
                        {!!formError && (
                          <FormHelperText>
                            <InfoOutlined />
                            {formError?.error}
                          </FormHelperText>
                        )}
                      </FormControl>
                    );
                  })}
                </Stack>
              ))}
          </Stack>
        </Stack>
        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
            <Button
              size='sm'
              variant='outlined'
              color='neutral'
              onClick={discardAllChanges}
            >
              Discard
            </Button>
            <Button size='sm' variant='solid' onClick={onSubmit}>
              Save Changes
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Stack>
  );
};

export default SocialPlatformDetails;
