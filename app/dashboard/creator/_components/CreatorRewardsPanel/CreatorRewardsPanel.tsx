import { useGetRewardsFromCreator } from "../../../../../hooks/useGetRewardsFromCreator";
import { Button, Divider, Loader, Space, Text, Group } from "@mantine/core";
import { CreatorRewardCardSkeletonClient } from "../CreatorRewardCard/CreatorRewardCardSkeletonClient";
import { CreatorRewardPaidCard } from "../CreatorRewardCard/CreatorRewardPaidCard";
import { CreatorRewardUnpaidCard } from "../CreatorRewardCard/CreatorRewardUnpaidCard";
import { InfinityList } from "../../../../_components/InfinityList";
import { useGetFilteredByPlatform } from "../../../../../hooks/useGetFilteredByPlatform";
import { NothingFound } from "../../../../_components/NothingFound";
import { IconMoneybag, IconDownload } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateNewRewardModal } from "./CreateNewRewardModal";
import { mutate } from "swr";
import { API_ROUTES } from "../../../../../constants";

export function CreatorRewardsPanel() {
    const [isModalOpen, { close: closeModal, open: openModal }] = useDisclosure();

    const { issues: allIssues, isLoading } = useGetRewardsFromCreator({ revalidateOnFocus: !isModalOpen });
    const issues = useGetFilteredByPlatform(allIssues);

    const unpaidRewards = [...issues].filter((issue) => !issue.isFullyPaid);
    const paidRewards = [...issues].filter((issue) => issue.isFullyPaid);

    const hasUnpaidRewards = unpaidRewards.length > 0;
    const hasPaidRewards = paidRewards.length > 0;

    const noRewards = !hasUnpaidRewards && !hasPaidRewards;

    const handleExportCSV = () => {
        const headers = ["Issue ID", "Title", "Status", "Platform"];
        const rows = issues.map((issue: any) => [
            issue?.issueId || "",
            `"${(issue?.title || "Reward Issue").replace(/"/g, '""')}"`,
            issue?.isFullyPaid ? "Paid" : "Active",
            issue?.platform || ""
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `opire_rewards.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const HeaderButtons = () => (
        <div>
            <Group>
                <Button
                    onClick={openModal}
                    size='md'
                    leftSection={<IconMoneybag size={14} />}
                    variant='gradient'
                >
                    Create a new reward
                </Button>
                <Button 
                    onClick={handleExportCSV} 
                    size='md' 
                    leftSection={<IconDownload size={14} />} 
                    variant='outline' 
                    color='violet'
                >
                    Export to CSV
                </Button>
            </Group>

            <CreateNewRewardModal
                isOpened={isModalOpen}
                onClose={closeModal}
                onNewRewardCreated={onNewRewardCreated}
            />
        </div>
    );

    if (isLoading) {
        return <Loader display='block' size='xl' m='30px auto' />;
    }

    if (noRewards) {
        return (
            <div>
                <HeaderButtons />

                <Space h='xl' />

                <NothingFound />
            </div>
        );
    }

    return (
        <div>
            <HeaderButtons />

            <Space h='xl' />

            {hasUnpaidRewards && (
                <>
                    <Text fw={900} size={"xl"}>Active</Text>
                    <Space h='12px' />
                    <InfinityList
                        items={unpaidRewards}
                        keyIdentifier="issueId"
                        isLoading={isLoading}
                        loadNextPage={() => { }}
                        ItemComponent={CreatorRewardUnpaidCard}
                        ItemSkeletonComponent={CreatorRewardCardSkeletonClient}
                    />
                </>
            )}

            {hasUnpaidRewards && hasPaidRewards && <Divider my="xl" />}

            {hasPaidRewards && (
                <>
                    <Text fw={900} size={"xl"}>Paid</Text>
                    <Space h='12px' />
                    <InfinityList
                        items={paidRewards}
                        keyIdentifier="issueId"
                        isLoading={isLoading}
                        loadNextPage={() => { }}
                        ItemComponent={CreatorRewardPaidCard}
                        ItemSkeletonComponent={CreatorRewardCardSkeletonClient}
                    />
                </>
            )}
        </div>
    );
}

function onNewRewardCreated() {
    mutate(API_ROUTES.REWARDS.CREATED_BY_ME());
}