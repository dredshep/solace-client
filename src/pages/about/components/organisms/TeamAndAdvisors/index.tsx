import React from 'react'
import { Flex, Grid } from '../../../../../components/atoms/Layout'
import { Text } from '../../../../../components/atoms/Typography'
import { useWindowDimensions } from '../../../../../hooks/useWindowDimensions'
import { SectionTitle } from '../../../../../components/atoms/Typography'
import advisorsAndContributors from '../../../../../resources/advisorsAndContributors'
import team from '../../../../../resources/team'

type TeamMember = {
  name: string
  role: string
  twitter?: string
}

type TeamMemberProps = {
  name: string
  role: string
  twitterUsername?: string
}

export function TeamMember({ name, role, twitterUsername }: TeamMemberProps): JSX.Element {
  const twitterUrl = `https://twitter.com/${twitterUsername}`
  const atUsername = `@${twitterUsername}`
  return (
    <Flex column gap={3}>
      <Text extrabold light mont t2_5s lineHeight={1.2}>
        {name}
      </Text>
      <Text t3s regular light>
        {role}
      </Text>
      {twitterUsername && (
        <Text t5s underline regular mt={3} light>
          <a href={twitterUrl} target="_blank" rel="noreferrer">
            {atUsername}
          </a>
        </Text>
      )}
    </Flex>
  )
}

export function ListOfPeople({
  list, // array of { name, role, twitter }
  title, // string
}: {
  list: TeamMember[]
  title: string
}): JSX.Element {
  const { isMobile } = useWindowDimensions()
  return (
    <Flex
      col
      stretch
      pr={isMobile ? undefined : 70}
      gap={isMobile ? 50 : 70}
      pl={isMobile ? 80 : undefined}
      justifyCenter
    >
      <SectionTitle light extrabold>
        {title}
      </SectionTitle>

      <Grid columnGap={60} rowGap={30} columns={isMobile ? 1 : 3}>
        {list.map(({ name, role, twitter }) => (
          <TeamMember key={name} name={name} role={role} twitterUsername={twitter} />
        ))}
      </Grid>
    </Flex>
  )
}

export const Investors = <ListOfPeople list={advisorsAndContributors} title="Investors" />
export const Advisors = <ListOfPeople list={advisorsAndContributors} title="Advisors" />
export const CoreContributors = <ListOfPeople list={team} title="Core contributors" />
