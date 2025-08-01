import { supabase } from '@/lib/supabase'
import { Memo, MemoFormData } from '@/types/memo'
import { Database } from '@/types/supabase'

type MemoRow = Database['public']['Tables']['memos']['Row']
type MemoInsert = Database['public']['Tables']['memos']['Insert']
type MemoUpdate = Database['public']['Tables']['memos']['Update']

// Convert database row to Memo interface
const convertRowToMemo = (row: MemoRow): Memo => ({
  id: row.id,
  title: row.title,
  content: row.content,
  category: row.category,
  tags: row.tags,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

// Convert Memo to database insert format
const convertMemoToInsert = (formData: MemoFormData): MemoInsert => ({
  title: formData.title,
  content: formData.content,
  category: formData.category,
  tags: formData.tags,
})

// Convert Memo to database update format
const convertMemoToUpdate = (formData: MemoFormData): MemoUpdate => ({
  title: formData.title,
  content: formData.content,
  category: formData.category,
  tags: formData.tags,
})

export const supabaseUtils = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading memos:', error)
        throw error
      }

      return data ? data.map(convertRowToMemo) : []
    } catch (error) {
      console.error('Failed to get memos:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (formData: MemoFormData): Promise<Memo> => {
    try {
      const insertData = convertMemoToInsert(formData)
      
      const { data, error } = await supabase
        .from('memos')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error adding memo:', error)
        throw error
      }

      return convertRowToMemo(data)
    } catch (error) {
      console.error('Failed to add memo:', error)
      throw error
    }
  },

  // 메모 업데이트
  updateMemo: async (id: string, formData: MemoFormData): Promise<Memo> => {
    try {
      const updateData = convertMemoToUpdate(formData)
      
      const { data, error } = await supabase
        .from('memos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating memo:', error)
        throw error
      }

      return convertRowToMemo(data)
    } catch (error) {
      console.error('Failed to update memo:', error)
      throw error
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to delete memo:', error)
      throw error
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        console.error('Error getting memo by id:', error)
        throw error
      }

      return data ? convertRowToMemo(data) : null
    } catch (error) {
      console.error('Failed to get memo by id:', error)
      return null
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    try {
      if (category === 'all') {
        return await supabaseUtils.getMemos()
      }

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting memos by category:', error)
        throw error
      }

      return data ? data.map(convertRowToMemo) : []
    } catch (error) {
      console.error('Failed to get memos by category:', error)
      return []
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    try {
      if (!query.trim()) {
        return await supabaseUtils.getMemos()
      }

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching memos:', error)
        throw error
      }

      return data ? data.map(convertRowToMemo) : []
    } catch (error) {
      console.error('Failed to search memos:', error)
      return []
    }
  },

  // 모든 메모 삭제
  clearAllMemos: async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (error) {
        console.error('Error clearing all memos:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to clear all memos:', error)
      throw error
    }
  },

  // 통계 정보 가져오기
  getMemoStats: async (): Promise<{
    total: number
    byCategory: Record<string, number>
  }> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('category')

      if (error) {
        console.error('Error getting memo stats:', error)
        throw error
      }

      const total = data?.length || 0
      const byCategory = data?.reduce(
        (acc, memo) => {
          acc[memo.category] = (acc[memo.category] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      ) || {}

      return { total, byCategory }
    } catch (error) {
      console.error('Failed to get memo stats:', error)
      return { total: 0, byCategory: {} }
    }
  },
}