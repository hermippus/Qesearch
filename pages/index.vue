<template>
  <div class="bg-[#2B2023] min-h-screen flex flex-col">
    <HeaderSection />
    <div class="flex flex-col items-center py-8">
      <SearchBar @search="fetchResearch" />
    </div>
    <div v-if="isLoading" class="text-center text-secondary">Loading...</div>
    <div v-else-if="error" class="text-center text-secondary">{{ error }}</div>
    <div v-else-if="!researchData.length" class="text-center text-secondary">No results found</div>
    <div v-else class="max-w-4xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      <ResearchCard v-for="item in researchData" :key="item.link" :title="item.title" :link="item.link" />
    </div>
    <FooterSection />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const researchData = ref([]);
const isLoading = ref(false);
const error = ref(null);

const fetchResearch = async (query) => {
  if (!query) {
    resetState();
    return;
  }

  isLoading.value = true;
  resetState();

  try {
    const [pubMedData, crossRefData] = await Promise.all([fetchPubMed(query), fetchCrossRef(query)]);
    researchData.value = [...pubMedData, ...crossRefData];
  } catch (err) {
    error.value = 'An error occurred while fetching data.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const resetState = () => {
  researchData.value = [];
  error.value = null;
};

const fetchPubMed = async (query) => {
  try {
    const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmode=xml`);
    const data = await response.text();
    const ids = parsePubMedIds(data);

    if (!ids.length) return [];

    const detailsResponse = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`);
    const detailsData = await detailsResponse.text();
    return parsePubMedDetails(detailsData);
  } catch (err) {
    console.error('Error fetching PubMed data:', err);
    return [];
  }
};

const parsePubMedIds = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, 'text/xml');
  return Array.from(xmlDoc.getElementsByTagName('Id')).map(id => id.textContent);
};

const parsePubMedDetails = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, 'text/xml');
  const items = xmlDoc.getElementsByTagName('PubmedArticle');

  return Array.from(items).map(item => ({
    title: item.querySelector('ArticleTitle')?.textContent || 'No title',
    link: `https://pubmed.ncbi.nlm.nih.gov/${item.querySelector('PMID')?.textContent}`,
  }));
};

const fetchCrossRef = async (query) => {
  try {
    const response = await fetch(`https://api.crossref.org/works?query=${query}`);
    const data = await response.json();
    return parseCrossRefData(data);
  } catch (err) {
    console.error('Error fetching CrossRef data:', err);
    return [];
  }
};

const parseCrossRefData = (data) => {
  const items = data.message?.items || [];
  return items.map(item => ({
    title: item.title?.[0] || 'No title',
    link: item.URL || '#',
  }));
};
</script>

<style>
.text-secondary {
  color: #DFDFDF;
}
</style>